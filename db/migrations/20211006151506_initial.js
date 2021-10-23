
exports.up = function(knex) {
     return knex.schema.createTable('users', t =>{
           t.uuid('id').primary()
           t.string('name').notNull()
           t.string('username').notNull()
           t.string("password").notNull()
           t.integer("role").default(0)
           t.timestamp('created_at').default(knex.fn.now())
           t.timestamp('updated_at').default(knex.fn.now())
           t.unique('username')
      })
     
     .createTable('addresses', t =>{
          t.uuid('id').primary()
          t.string('street').notNull()
          t.string('region').notNull()
          t.string('number').notNull()
          t.specificType('uf', 'char(2)').notNull()
          t.string('postalCode', 'char(8)').notNull()
          t.string('city').notNull()
          t.text('details')
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })
  
     .createTable('stations', t =>{
          t.uuid('id').primary()
          t.text('description')
          t.float('longitude').notNull()
          t.float('latitude').notNull()
          t.float("altitude").notNull()
          t.uuid("address_id").notNull().references('addresses.id').onDelete('CASCADE');
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })

    .createTable('users_addresses', t =>{
          t.uuid('user_id').notNull().references('users.id').onDelete('CASCADE').unique();
          t.uuid('address_id').notNull().references('addresses.id').onDelete('CASCADE');
          t.primary(['user_id', 'address_id']);
     })

     .createTable('measurements', t =>{
          t.uuid('id').primary()
          t.float('temperature')
          t.float('airHumidity').notNull()
          t.float('rainVolume').notNull()
          t.float("windSpeed").notNull()
          t.float('windDirection').notNull()
          t.json("coordinates").notNull()
          t.uuid("station_id").references('stations.id').onDelete('CASCADE');
          t.timestamp('created_at').notNull()
          /*           t.specificType('windDirection', 'char(3)').notNull() */
     }) 
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('measurements').dropTable("users_addresses").dropTable("stations").dropTable("users").dropTable("addresses")
};
