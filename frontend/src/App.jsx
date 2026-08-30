import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import {
    AuthProvider
} from "./context/AuthContext";

import ProtectedRoute
    from "./components/ProtectedRoute";

import Layout
    from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    {/* Public */}

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* Protected */}

                    <Route
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/income"
                            element={<Income />}
                        />

                        <Route
                            path="/expenses"
                            element={<Expenses />}
                        />

                        <Route
                            path="/reports"
                            element={<Reports />}
                        />

                    </Route>

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}

export default App;