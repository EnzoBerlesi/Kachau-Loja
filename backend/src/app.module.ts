import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CategoriesModule } from './categories/categories.module';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, ProductsModule, OrdersModule, CategoriesModule, CheckoutModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
