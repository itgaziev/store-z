import { DataSource } from 'typeorm'; // Assuming TypeORM
import { seedData } from './data';
import * as bcrypt from 'bcrypt';

export default async function runSeed(dataSource: DataSource) {
    console.log('🌱 Starting seed...');

    let data = seedData;
    const roleRepository = dataSource.getRepository('roles');
    const userRepository = dataSource.getRepository('users');
    const sectionRepository = dataSource.getRepository('sections');
    const productRepository = dataSource.getRepository('products');
    const warehouseRepository = dataSource.getRepository('warehouses');

    console.log('📋 Seeding Roles...');
    const roles: Record<string, any> = {};
    for (const roleData of data.roles) {
        let role = await roleRepository.findOne({ where: { name: roleData.name } });
        if (!role) {
            role = roleRepository.create(roleData)
            await roleRepository.save(role);
            console.log(`   ✅ Role ${roleData.name} created`);
        } else {
            console.log(`   ⏭️  Role ${roleData.name} exists`);
        }

        roles[roleData.name] = role;
    }

    console.log('📋 Seeding Role Permissions...');
    const permissionRepository = dataSource.getRepository('role_permissions');
    for (const permData of data.rolePermissions) {
        const role = roles[permData.role];
        if (!role) continue;

        const existingPerm = await permissionRepository.findOne({
            where: { roleId: role.id, modelName: permData.model, access: permData.access }
        });

        if (!existingPerm) {
            const permission = permissionRepository.create({
                roleId: role.id,
                modelName: permData.model,
                access: permData.access
            });
            await permissionRepository.save(permission);
            console.log(`   ✅ ${permData.role} -> ${permData.model}:${permData.access}`);
        } else {
            console.log(`   ⏭️  ${permData.role} -> ${permData.model}:${permData.access} exists`);
        }
    }

    console.log('Seeding Users ...');
    const users: Record<string, any> = {}
    for (const userData of data.users) {
        let user = await userRepository.findOne({ where: { email: userData.email } });
        if (!user) {
            const role = await roleRepository.findOne({ where: { name: userData.role ?? 'USER' }});
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const userNew: any = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: hashedPassword,
                role: role
            }

            user = userRepository.create(userNew)
            await userRepository.save(user);
            console.log(`User ${userData.email} created`);
        } else {
            console.log(`User ${userData.email} exists`);
        }

        users[userData.email] = user;
    }

    console.log('Seeding Sections ...');
    const sections: Record<string, any> = {};
    for (const sectionData of data.sections) {
        let section = await sectionRepository.findOne({ where: { code: sectionData.code } });
        if (!section) {
            const newSectionData: any = {
                code: sectionData.code, // Не забудьте про код, если он нужен в базе
                name: sectionData.name,
                description: sectionData.description,
            };
            if (sectionData.parent) {
                let parent = await sectionRepository.findOne({ where: { code: sectionData.parent } })
                if (parent) {
                    newSectionData.parent = parent;
                }
            }
            section = sectionRepository.create(newSectionData);
            await sectionRepository.save(section);
            console.log(`Section ${sectionData.name} created`);
        } else {
            console.log(`Section ${sectionData.name} exists`);
        }
        sections[sectionData.name] = section;
    }

    console.log('Seeding Warehouses...');
    const warehouses: Record<string, any> = {};
    for (const warehouseData of data.warehouses) {
        let warehouse = await warehouseRepository.findOne({ where: { code: warehouseData.code } });
        if (!warehouse) {
            warehouse = warehouseRepository.create(warehouseData);
            await warehouseRepository.save(warehouse);
            console.log(`Warehouse ${warehouseData.name} created`);
        } else {
            console.log(`Warehouse ${warehouseData.name} exists`);
        }

        warehouses[warehouseData.code] = warehouse;
    }

    console.log('Seeding Products...');
    const products: any[] = [];
    for (const productData of data.products) {
        let product = await productRepository.findOne({ where: { sku: productData.sku } });

        if (!product) {
            const productNew: any = {
                name: productData.name,
                description: productData.description,
                sku: productData.sku
            };

            if (productData.sectionId) {
                let section = await sectionRepository.findOne({ where: { code: productData.sectionId } });
                if (section) {
                    productNew.section = section;
                }
            }

            product = productRepository.create(productNew);
            await productRepository.save(product);
            products.push(product);
            console.log(`Product ${productData.name} created`);
        } else {
            products.push(product);
            console.log(`Product ${productData.name} exists`);
        }
    }

    console.log('✅ Seed completed successfully!');
}