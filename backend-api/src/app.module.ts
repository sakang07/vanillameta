import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { DatasetModule } from './dataset/dataset.module';
import { WidgetModule } from './widget/widget.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TemplateModule } from './template/template.module';
import { CommonModule } from './common/common.module';
import { ComponentModule } from './component/component.module';
import { ConnectionModule } from './connection/connection.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { ShareUrlModule } from './share-url/share-url.module';
import * as ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV == 'dev' ? '.env.dev' : '.env.ci',
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sqlite.db',
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV == 'dev',
      retryAttempts: 1,
      dropSchema: false, // 매번 실행시마다 테이블 drop false


    }),

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT) || 3306,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    //   autoLoadEntities: true,
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: false,
    //   logging: process.env.NODE_ENV == 'dev',
    //   retryAttempts: 1,
    // }),
    DatabaseModule,
    DatasetModule,
    WidgetModule,
    DashboardModule,
    TemplateModule,
    CommonModule,
    ComponentModule,
    ConnectionModule,
    UserModule,
    AuthModule,
    LoginModule,
    ShareUrlModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
