require('dotenv').config();
const { sequelize } = require('./config/db');
const { User, Post, Comment } = require('./models/index');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connected.');

    // Sync models with database
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create test users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'user'
    });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Users created.');

    // Create test posts/events
    const posts = await Post.bulkCreate([
      {
        userId: user1.id,
        title: 'Community Garage Sale',
        description: 'Annual community garage sale with great deals on furniture, clothes, and more!',
        category: 'Garage Sales',
        date: new Date('2023-06-15'),
        time: '9:00 AM - 4:00 PM',
        location: 'Maple Street Community Center'
      },
      {
        userId: user1.id,
        title: 'Yoga in the Park',
        description: 'Join us for a relaxing yoga session in the park. All levels welcome!',
        category: 'Community Classes',
        date: new Date('2023-06-20'),
        time: '8:00 AM - 9:30 AM',
        location: 'Central Park'
      },
      {
        userId: user2.id,
        title: 'Local Soccer Tournament',
        description: 'Annual soccer tournament with teams from all around the city.',
        category: 'Sports Matches',
        date: new Date('2023-07-05'),
        time: '10:00 AM - 4:00 PM',
        location: 'City Sports Complex'
      },
      {
        userId: user2.id,
        title: 'Beach Cleanup Volunteer Day',
        description: 'Help keep our beaches clean! Bring gloves and sunscreen.',
        category: 'Volunteer',
        date: new Date('2023-07-12'),
        time: '9:00 AM - 12:00 PM',
        location: 'Main Beach'
      },
      {
        userId: admin.id,
        title: 'Art Exhibition Opening',
        description: 'Opening night of the annual local artists exhibition.',
        category: 'Exhibitions',
        date: new Date('2023-07-20'),
        time: '6:00 PM - 9:00 PM',
        location: 'Downtown Gallery'
      },
      {
        userId: admin.id,
        title: 'Summer Food Festival',
        description: 'Celebrate summer with food from local restaurants and food trucks!',
        category: 'Festivals',
        date: new Date('2023-08-01'),
        time: '11:00 AM - 8:00 PM',
        location: 'Riverfront Park'
      }
    ]);

    console.log('Posts created.');

    // Create test comments
    await Comment.bulkCreate([
      {
        userId: user2.id,
        postId: posts[0].id,
        text: 'Looking forward to this! Will there be any electronics?'
      },
      {
        userId: user1.id,
        postId: posts[2].id,
        text: 'Can beginners join the tournament?'
      },
      {
        userId: admin.id,
        postId: posts[3].id,
        text: 'Great initiative! I\'ll be bringing some friends.'
      }
    ]);

    console.log('Comments created.');
    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 