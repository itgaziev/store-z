export const seedData = {
    sections: [
        { name: "Products", description: "Demo Products", code: "SECT-000" },
        { name: "Electronics", description: "Devices and gadgets", code: "SECT-001", parent: "SECT-000" },
        { name: "Books", description: "Literature and educational materials", code: "SECT-002", parent: "SECT-000" },
        { name: "Clothing", description: "Apparel for all occasions", code: "SECT-003", parent: "SECT-000" },
    ],
    warehouses: [
        { name: "Main Warehouse", location: "123 Distribution Way", code: "STORE" },
        { name: "Retail Outlet A", location: "456 Market Street", code: "MARKET" },
    ],
    roles: [
        { name: "ADMIN", description: "System administrator" },
        { name: "MANAGER", description: "Warehouse or department manager" },
        { name: "USER", description: "End user of the system" },
    ],
    products: [
        { name: "Laptop Pro", description: "High-performance laptop", sectionId: "SECT-001", sku: "DEMO-001" },
        { name: "The Great Novel", description: "A captivating story", sectionId: "SECT-002", sku: "DEMO-002" },
        { name: "Running Shoes", description: "Comfortable athletic footwear", sectionId: "SECT-003", sku: "DEMO-003" },
    ],
    users: [
        { firstName: "admin", lastName: "user", email: "admin@example.com", password: "admin_password", role: "ADMIN" },
        { firstName: "manager", lastName: "Bob", email: "manager@example.com", password: "manager_password", role: "MANAGER" },
        { firstName: "user", lastName: "Jane", email: "user@example.com", password: "user_password", role: "USER" },
    ],
};