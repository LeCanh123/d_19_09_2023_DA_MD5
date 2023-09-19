import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';

export const productProviders = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      try {
        return dataSource.getRepository(Product);
      } catch (err) {
        console.log("Chưa kết nối database");
      }


    },
    inject: ['DATA_SOURCE'],
  },
];