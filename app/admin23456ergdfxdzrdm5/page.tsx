// app/admin/page.tsx
"use client";
import React, { useState, useEffect } from "react";

type SubscriptionPlan = "day" | "week" | "month" | "lifetime";

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  day: 6,
  week: 13,
  month: 20,
  lifetime: 34,
};

interface Subscription {
  id: number;
  email: string;
  plan: SubscriptionPlan;
  price: number;
  startDate: string;
}

interface PendingSubscription {
  id: number;
  user_id: number;
  package_price: number;
  image_url: string;
  status: string;
  createdAt: string;
  user: {
    email: string;
    name: string;
  };
}

interface AdminUser {
  admin_id: number;
  email: string;
  name: string;
  role: "admin";
}

export default function AdminPanel() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pendingSubscriptions, setPendingSubscriptions] = useState<PendingSubscription[]>([]);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<SubscriptionPlan>("day");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        const user = JSON.parse(userData);
        if (user.role === "admin") {
          setIsAuthenticated(true);
          setAdminUser(user);
          // Fetch data if authenticated
          fetchSubscriptions();
          fetchPendingSubscriptions();
        } else {
          // Not an admin, clear storage
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error("Error checking authentication:", err);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError("Email and password are required");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("http://localhost:3001/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token and user data
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setIsAuthenticated(true);
      setAdminUser(data.user);
      
      // Fetch data after successful login
      fetchSubscriptions();
      fetchPendingSubscriptions();
      
      setLoginEmail("");
      setLoginPassword("");
      
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setAdminUser(null);
    setSubscriptions([]);
    setPendingSubscriptions([]);
  };

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3001/api/admin/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        // Transform the data to match your UI format
        const transformedSubscriptions = data.subscriptions.map((sub: any) => ({
          id: sub.id,
          email: sub.client?.email || 'N/A',
          plan: getPlanFromPrice(sub.package_price),
          price: sub.package_price,
          startDate: new Date(sub.createdAt).toLocaleDateString(),
        }));
        setSubscriptions(transformedSubscriptions);
      } else if (res.status === 401 || res.status === 403) {
        // Token expired or not admin
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    }
  };

  // Helper function to convert price to plan name
  const getPlanFromPrice = (price: number): SubscriptionPlan => {
    switch (price) {
      case 6: return 'day';
      case 13: return 'week';
      case 20: return 'month';
      case 34: return 'lifetime';
      default: return 'day';
    }
  };

  const fetchPendingSubscriptions = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3001/api/admin/pending-subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setPendingSubscriptions(data.pendingSubscriptions || []);
      } else if (res.status === 401 || res.status === 403) {
        // Token expired or not admin
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching pending subscriptions:", err);
    }
  };

  async function handleAddSubscription(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return alert("Please enter an email");

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");

      const res = await fetch("http://localhost:3001/api/admin/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          client_email: email,
          client_name: email.split("@")[0],
          package_price: PLAN_PRICES[plan],
        }),
      });

      const data = await res.json();

       if (res.status==421) {
           throw new Error("User doesnt exist");

      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to create subscription");
      }
     

      const newSub: Subscription = {
        id: data.subscription.id,
        email,
        plan,
        price: PLAN_PRICES[plan],
        startDate: new Date().toLocaleDateString(),
      };

      setSubscriptions((prev) => [...prev, newSub]);
      setEmail("");
      setPlan("day");
      alert("Subscription created successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this subscription?")) return;
    
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3001/api/admin/subscribe/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete subscription");
      }

      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      alert("Subscription deleted successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleApprovePending(id: number) {
    if (!confirm("Approve this subscription?")) return;
    
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3001/api/admin/pending-subscriptions/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to approve subscription");
      }

      // Remove from pending and refresh active subscriptions
      setPendingSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      fetchSubscriptions();
      alert("Subscription approved successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleRejectPending(id: number) {
    if (!confirm("Reject this subscription request?")) return;
    
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3001/api/admin/pending-subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to reject subscription");
      }

      setPendingSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      alert("Subscription rejected successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  }

  // Show loading while checking authentication
  if (isLoadingAuth) {
    return (
      <div className="admin-wrap">
        <div className="loading">Loading...</div>
        <style jsx>{`
          .admin-wrap {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            text-align: center;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .loading {
            font-size: 18px;
            color: #666;
          }
        `}</style>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-wrap">
        <div className="login-container">
          <h1>Admin Login</h1>
          <p>Please login with your admin credentials</p>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                placeholder="Admin Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}

            <button type="submit" disabled={loginLoading} className="login-button">
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <style jsx>{`
          .admin-wrap {
            max-width: 400px;
            margin: 100px auto;
            padding: 40px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .login-container {
            text-align: center;
          }
          
          h1 {
            margin-bottom: 10px;
            font-size: 24px;
            font-weight: bold;
          }
          
          p {
            margin-bottom: 30px;
            color: #666;
          }
          
          .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          
          .form-group {
            display: flex;
            flex-direction: column;
          }
          
          .form-group input {
            padding: 12px 16px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 14px;
          }
          
          .form-group input:focus {
            outline: none;
            border-color: #000;
          }
          
          .error-message {
            background: #fed7d7;
            color: #c53030;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            border: 1px solid #feb2b2;
          }
          
          .login-button {
            padding: 12px 16px;
            border: none;
            background: black;
            color: white;
            font-weight: bold;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
          }
          
          .login-button:hover:not(:disabled) {
            background: #333;
          }
          
          .login-button:disabled {
            background: #666;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  }

  // Show admin panel if authenticated
  return (
    <div className="admin-wrap">
      {/* Header with user info and logout */}
      <div className="admin-header">
        <div>
          <h1>Admin Panel — Subscriptions</h1>
          <p className="welcome-message">
            Welcome, {adminUser?.name || adminUser?.email}!
          </p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Subscriptions
        </button>
        <button 
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Subscriptions ({pendingSubscriptions.length})
        </button>
      </div>

      {/* Active Subscriptions Tab */}
      {activeTab === "active" && (
        <>
          {/* New Subscription Form */}
          <form className="form" onSubmit={handleAddSubscription}>
            <input
              type="email"
              placeholder="User email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as SubscriptionPlan)}
            >
              <option value="day">Day — $6</option>
              <option value="week">Week — $13</option>
              <option value="month">Month — $20</option>
              <option value="lifetime">Lifetime — $34</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Subscription"}
            </button>
          </form>

          {/* Active Subscription List */}
          <div className="subs-list">
            {subscriptions.length === 0 ? (
              <p>No active subscriptions yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Start Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.email}</td>
                      <td>{sub.plan}</td>
                      <td>${sub.price}</td>
                      <td>{sub.startDate}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(sub.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Pending Subscriptions Tab */}
      {activeTab === "pending" && (
        <div className="pending-list">
          {pendingSubscriptions.length === 0 ? (
            <p>No pending subscription requests.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Package Price</th>
                  <th>Payment Proof</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingSubscriptions.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.user?.email || 'N/A'}</td>
                    <td>${sub.package_price}</td>
                    <td>
                      {sub.image_url && (
                        <a 
                          href={sub.image_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="proof-link"
                        >
                          View Proof
                        </a>
                      )}
                    </td>
                    <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="action-buttons">
                      <button 
                        className="approve-btn"
                        onClick={() => handleApprovePending(sub.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectPending(sub.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <style jsx>{`
        .admin-wrap {
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        h1 {
          margin-bottom: 5px;
          font-size: 24px;
          font-weight: bold;
        }
        
        .welcome-message {
          color: #666;
          margin: 0;
        }
        
        .logout-button {
          padding: 8px 16px;
          border: 1px solid #dc2626;
          background: white;
          color: #dc2626;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .logout-button:hover {
          background: #dc2626;
          color: white;
        }
        
        /* Tabs */
        .tabs {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
        }
        .tab {
          padding: 12px 24px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .tab.active {
          border-bottom-color: #000;
          color: #000;
        }
        .tab:hover {
          background: #f5f5f5;
        }

        /* Form */
        .form {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }
        .form input,
        .form select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          flex: 1;
        }
        .form button {
          padding: 10px 16px;
          border: none;
          background: black;
          color: white;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
        }
        .form button:hover {
          background: #333;
        }
        .form button:disabled {
          background: #666;
          cursor: not-allowed;
        }

        /* Tables */
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        th {
          background: #f8f8f8;
          font-weight: 600;
        }

        /* Buttons */
        .delete-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #dc2626;
          color: white;
          cursor: pointer;
          font-size: 12px;
        }
        .delete-btn:hover {
          background: #b91c1c;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .approve-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #059669;
          color: white;
          cursor: pointer;
          font-size: 12px;
        }
        .approve-btn:hover {
          background: #047857;
        }
        .reject-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          background: #dc2626;
          color: white;
          cursor: pointer;
          font-size: 12px;
        }
        .reject-btn:hover {
          background: #b91c1c;
        }

        .proof-link {
          color: #2563eb;
          text-decoration: none;
        }
        .proof-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}