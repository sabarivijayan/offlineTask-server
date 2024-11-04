import productModel from './models/product-model.js';
import path from 'path'


const productData = [
  {
    name: 'Cool Water',
    price: 40,
    suk: 'PF1',
    image: '/images/pf-1.svg',
  },
  {
    name: 'Lataffa',
    price: 80,
    suk: 'PF2',
    image: '/images/sp-2.svg',
  },
  {
    name: 'CK',
    price: 50,
    suk: 'PF3',
    image: '/images/sp-3.svg',
  },
  {
    name: 'Lataffa',
    price: 120,
    suk: 'PF4',
    image: '/images/sp-4.svg',
  },
  {
    name: 'Gucci Bloom',
    price: 100,
    suk: 'PF5',
    image: '/images/sp-5.svg',
  },
  {
    name: 'Chanel No.5',
    price: 150,
    suk: 'PF6',
    image: '/images/sp-6.svg',
  },
];

export async function seedProducts() {
  try {
    for (const data of productData) {
      const product = new productModel({
        name: data.name,
        price: data.price,
        suk: data.suk,
        image: path.join('./public', data.image),
      });
      await product.save();
      console.log(`Seeded: ${product.name}`);
    }

    console.log('Seeding complete');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}
