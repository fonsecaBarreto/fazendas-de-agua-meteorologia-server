
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
          t.specificType('number', 'char(20)').notNull()
          t.specificType('uf', 'char(2)').notNull()
          t.integer('postalCode').notNull()
          t.string('city').notNull()
          t.text('details')
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
      })
  
     .createTable('stations', t =>{
          t.uuid('id').primary()
          t.text('description')
          t.integer('longitude').notNull()
          t.integer('latitude').notNull()
          t.integer("altitude").notNull()
          t.uuid("address_id").references('addresses.id').onDelete('SET NULL');
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     })

    .createTable('users_stations', t =>{
          t.uuid('user_id').references('users.id').onDelete('CASCADE');
          t.uuid('station_id').references('stations.id').onDelete('CASCADE');
          t.primary(['user_id', 'station_id']);
     })

     .createTable('measurements', t =>{
          t.uuid('id').primary()
          t.text('temperature')
          t.integer('airHumidity').notNull()
          t.integer('rainVolume').notNull()
          t.integer("windSpeed").notNull()
          t.integer("windDirection").notNull()
          t.json("coordinates").notNull()
          t.uuid("station_id").references('stations.id').onDelete('SET NULL');
          t.uuid("created_by").references('users.id').onDelete('SET NULL');
          t.timestamp('created_at').default(knex.fn.now())
          t.timestamp('updated_at').default(knex.fn.now())
     }) 
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('measurements').dropTable("users_stations").dropTable("stations").dropTable("users").dropTable("addresses")
};
