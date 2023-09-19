import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from '../productimages/entities/productimage.entity';

export const productProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      try {
        const productRepository = dataSource.getRepository(Product);
        const productImageRepository = dataSource.getRepository(ProductImage);
        return { productRepository, productImageRepository };
      } catch (err) {
        console.log("Chưa kết nối database");
      }


    },
    inject: ['DATA_SOURCE'],
  },
];