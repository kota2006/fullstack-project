const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Certification = require('./models/Certification');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Certification.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@certapp.com',
            password: 'password123',
            role: 'admin'
        });

        const studentUser = await User.create({
            name: 'Regular Student',
            email: 'student@certapp.com',
            password: 'password123',
            role: 'user'
        });

        console.log('👤 Created users:');
        console.log(`   Admin  → admin@certapp.com / password123`);
        console.log(`   Student → student@certapp.com / password123`);

        // Create certifications (for the student user)
        const certifications = [
            {
                userId: studentUser._id,
                certName: 'AWS Certified Developer Associate',
                issuer: 'Amazon Web Services',
                issueDate: new Date('2023-05-01'),
                expiryDate: new Date('2027-05-01'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'CompTIA Security+',
                issuer: 'CompTIA',
                issueDate: new Date('2021-03-15'),
                expiryDate: new Date('2024-03-15'),
                certUrl: '#',
                status: 'expired'
            },
            {
                userId: studentUser._id,
                certName: 'Certified Kubernetes Administrator',
                issuer: 'Cloud Native Computing Foundation',
                issueDate: new Date('2022-11-20'),
                expiryDate: new Date('2026-11-20'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'Google Cloud Professional Cloud Architect',
                issuer: 'Google',
                issueDate: new Date('2024-01-10'),
                expiryDate: new Date('2026-01-10'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'Microsoft Certified: Azure Fundamentals',
                issuer: 'Microsoft',
                issueDate: new Date('2023-08-05'),
                expiryDate: new Date('2025-08-05'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'Cisco Certified Network Associate (CCNA)',
                issuer: 'Cisco',
                issueDate: new Date('2021-06-12'),
                expiryDate: new Date('2024-06-12'),
                certUrl: '#',
                status: 'expired'
            },
            {
                userId: studentUser._id,
                certName: 'Certified ScrumMaster (CSM)',
                issuer: 'Scrum Alliance',
                issueDate: new Date('2024-02-18'),
                expiryDate: new Date('2026-02-18'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'Project Management Professional (PMP)',
                issuer: 'PMI',
                issueDate: new Date('2022-09-30'),
                expiryDate: new Date('2025-09-30'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'ITIL Foundations',
                issuer: 'Axelos',
                issueDate: new Date('2020-04-22'),
                expiryDate: new Date('2026-04-22'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'Oracle Certified Professional, Java SE 11 Developer',
                issuer: 'Oracle',
                issueDate: new Date('2021-12-05'),
                expiryDate: new Date('2026-12-05'),
                certUrl: '#',
                status: 'active'
            },
            {
                userId: studentUser._id,
                certName: 'Certified Ethical Hacker (CEH)',
                issuer: 'EC-Council',
                issueDate: new Date('2022-07-14'),
                expiryDate: new Date('2025-07-14'),
                certUrl: '#',
                status: 'active'
            }
        ];

        await Certification.insertMany(certifications);
        console.log(`📜 Created ${certifications.length} certifications`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();
