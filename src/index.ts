import { Many } from "drizzle-orm"
import { One } from "drizzle-orm"

// User-Address: One-to-Many (One user can have multiple addresses).
// User-Comment: One-to-Many (One user can have multiple comments).
// User-Order: One-to-Many (One user can have multiple orders).
// User-RestaurantOwner: One-to-Many (One user can own multiple restaurants).
// City-Address: One-to-Many (One city can have multiple addresses).
// State-City: One-to-Many (One state can have multiple cities).
// Restaurant-City: Many-to-One (Many restaurants can be in one city).
// Restaurant-RestaurantOwner: One-to-Many (A restaurant can be owned bymultiple owners ).
// Restaurant-MenuItem: One-to-Many (One restaurant can have multiple menu items).
// Restaurant-Order: one to many (one restaurant can have multiple orders)
// Order-OrderMenuItem: One-to-Many (One order can have multiple order menu items).
// Order-User: Many-to-One (Many orders can be placed by one user).
// Address-Order:One-to-Many(one address can have many orders)
// Order-Driver: Many-to-One (Many orders can be delivered by one driver).
// Order-Comment: One-to-Many (One order can have multiple comments).
// Order-OrderStatus: One-to-Many (One order can have multiple status updates).
// MenuItem-OrderMenuItem: one-to-many (one  menu-item MAY BE PRESENT IN MANY ORDER MENU ITEMS).
// StatusCatalog-OrderStatus: One-to-Many (One status catalog entry can be referenced by many order statuses). 
// driver-users(many-to-1)   