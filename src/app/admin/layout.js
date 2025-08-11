// src/app/admin/layout.js
export const metadata = {
    title: 'Admin Panel - Affiliate Chain',
    description: 'Admin dashboard for managing affiliate offers',
}

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}