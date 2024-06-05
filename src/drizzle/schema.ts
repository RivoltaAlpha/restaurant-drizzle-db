import { pgTable, serial, text, integer, boolean, numeric, timestamp, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import {relations} from 'drizzle-orm';
import { Many } from 'drizzle-orm';


// Restaurant table
export const restaurant = pgTable('restaurant', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    street_address: text('street_address').notNull().references(() => address.street_address_1, { onDelete: "cascade" }),
    zip_code: text('zip_code').notNull().references(() => address.zip_code, { onDelete: "cascade" }),
    city_id: integer('city_id').notNull().references(() => city.id, { onDelete: "cascade" }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const restaurantRelations = relations(restaurant, ({ one, many }) => ({
    city: one(city, {
        fields: [restaurant.city_id],
        references: [city.id],
    }),
    owners: many(restaurant_owner),
    menu_items: many(menu_item),
    orders: many(orders),
}));

// RestaurantOwner table
export const restaurant_owner = pgTable('restaurant_owner', {
    restaurant_id: integer('restaurant_id').notNull().references(() => restaurant.id, {onDelete:'cascade'}),
    owner_id: integer('owner_id').notNull().references(() => users.id, {onDelete:'cascade'}),
}, table => ({
    pk: primaryKey({ columns: [table.restaurant_id, table.owner_id] })
}));

export const restaurantOwnerRelations = relations(restaurant_owner, ({ one }) => ({
    restaurant: one(restaurant, {
        fields: [restaurant_owner.restaurant_id],
        references: [restaurant.id],
    }),
    owner: one(users, {
        fields: [restaurant_owner.owner_id],
        references: [users.id],
    }),
}));

// MenuItem table
export const menu_item = pgTable('menu_item', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    restaurant_id: integer('restaurant_id').notNull().references(() => restaurant.id, { onDelete: "cascade" }),
    category_id: integer('category_id').notNull().references(() => category.id, { onDelete: "cascade" }),
    description: text('description').notNull(),
    ingredients: text('ingredients').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    active: boolean('active').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const menuItemRelations = relations(menu_item, ({ one, many }) => ({
    restaurant: one(restaurant, {
        fields: [menu_item.restaurant_id],
        references: [restaurant.id],
    }),
    category: one(category, {
        fields: [menu_item.category_id],
        references: [category.id],
    }),
    order_menu_items: many(order_menu_item),
}));

// Category table
export const category = pgTable('category', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});

export const categoryRelations = relations(category, ({ many }) => ({
    menu_items: many(menu_item),
}));

// orders Table
export const orders = pgTable('orders', {
    id: serial('id').primaryKey(),
    restaurant_id: integer('restaurant_id').notNull().references(() => restaurant.id, { onDelete: "cascade" }),
    estimated_delivery_time: timestamp('estimated_delivery_time').notNull(),
    actual_delivery_time: timestamp('actual_delivery_time'),
    delivery_address_id: integer('delivery_address_id').notNull(),
    user_id: integer('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    driver_id: integer('driver_id').notNull().references(() => driver.id, { onDelete: "cascade" }),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    discount: numeric('discount', { precision: 10, scale: 2 }).notNull(),
    final_price: numeric('final_price', { precision: 10, scale: 2 }).notNull(),
    comment: text('comment'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
    restaurant: one(restaurant, {
        fields: [orders.restaurant_id],
        references: [restaurant.id],
    }),
    delivery_address: one(address, {
        fields: [orders.delivery_address_id],
        references: [address.id],
    }),
    user: one(users, {
        fields: [orders.user_id],
        references: [users.id],
    }),
    driver: one(driver, {
        fields: [orders.driver_id],
        references: [driver.id],
    }),
    order_menu_items: many(order_menu_item),
    order_statuses: many(order_status),
    comments: many(comment),
}));

// OrderMenuItem table
export const order_menu_item = pgTable('order_menu_item', {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: "cascade" }),
    menu_item_id: integer('menu_item_id').notNull().references(() => menu_item.id, { onDelete: "cascade" }),
    quantity: integer('quantity').notNull(),
    item_price: numeric('item_price', { precision: 10, scale: 2 }).notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    comment: text('comment'),
});

export const orderMenuItemRelations = relations(order_menu_item, ({ one }) => ({
    order: one(orders, {
        fields: [order_menu_item.order_id],
        references: [orders.id],
    }),
    menu_item: one(menu_item, {
        fields: [order_menu_item.menu_item_id],
        references: [menu_item.id],
    }),
}));

// OrderStatus table
export const order_status = pgTable('order_status', {
    id: serial('id').primaryKey(),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: "cascade" }),
    status_catalog_id: integer('status_catalog_id').notNull().references(() => status_catalog.id, { onDelete: "cascade" }),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export const orderStatusRelations = relations(order_status, ({ one }) => ({
    order: one(orders, {
        fields: [order_status.order_id],
        references: [orders.id],
    }),
    status_catalog: one(status_catalog, {
        fields: [order_status.status_catalog_id],
        references: [status_catalog.id],
    }),
}));

// StatusCatalog table
export const status_catalog = pgTable('status_catalog', {
    id: serial('id').primaryKey(),
    name: text('name'),
});

export const statusCatalogRelations = relations(status_catalog, ({ many }) => ({
    order_statuses: many(order_status),
}));

// Driver table
export const driver = pgTable('driver', {
    id: serial('id').primaryKey(),
    car_make: text('car_make').notNull(),
    car_model: text('car_model').notNull(),
    car_year: integer('car_year').notNull(),
    user_id: integer('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    online: boolean('online').notNull(),
    delivering: boolean('delivering').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const driverRelations = relations(driver, ({ many, one }) => ({
    user: one(users, {
        fields: [driver.user_id],
        references: [users.id],
    }),
    orders: many(orders),
}));


// Users table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    contact_phone: text('contact_phone').notNull(),
    phone_verified: boolean('phone_verified').notNull(),
    email: text('email').notNull(),
    email_verified: boolean('email_verified').notNull(),
    confirmation_code: text('confirmation_code').notNull(),
    password: text('password').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    addresses: many(address),
    comments: many(comment),
    orders: many(orders),
    restaurant_owners: many(restaurant_owner),
    drivers: many(driver),
}));

// Comment table
export const comment = pgTable('comment', {
    id: serial('id').primaryKey(),
    user_id: integer('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    order_id: integer('order_id').notNull().references(() => orders.id, { onDelete: "cascade" }),
    comment: text('comment').notNull(),
    is_complaint: boolean('is_complaint').notNull(),
    is_praise: boolean('is_praise').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const commentRelations = relations(comment, ({ one }) => ({
    user: one(users, {
        fields: [comment.user_id],
        references: [users.id],
    }),
    order: one(orders, {
        fields: [comment.order_id],
        references: [orders.id],
    }),
}));

// Address table
export const address = pgTable('address', {
    id: serial('id').primaryKey(),
    street_address_1: text('street_address_1').notNull(),
    street_address_2: text('street_address_2'),
    zip_code: text('zip_code').notNull(),
    delivery_instructions: text('delivery_instructions'),
    user_id: integer('user_id').notNull().references(() => users.id, { onDelete: "cascade" }),
    city_id: integer('city_id').notNull().references(() => city.id, { onDelete: "cascade" }),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
});

/// 
export const addressRelations = relations(address, ({many, one }) => ({
    user: one(users, {
        fields: [address.user_id],
        references: [users.id],
    }),
    city: one(city, {
        fields: [address.city_id],
        references: [city.id],
    }),
    orders: many(orders),
}));

// City table
export const city = pgTable('city', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    state_id: integer('state_id').notNull().references(() => state.id, { onDelete: "cascade" }),
});

export const cityRelations = relations(city, ({ many, one }) => ({
    addresses: many(address),
    state: one(state, {
        fields: [city.state_id],
        references: [state.id],
    }),
    restaurants: many(restaurant),
}));

// State table
export const state = pgTable('state', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull(),
});

export const stateRelations = relations(state, ({ many }) => ({
    cities: many(city),
}));