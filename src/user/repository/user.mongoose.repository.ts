import { InjectModel } from '@nestjs/mongoose';
// import { UserAbstractRepository } from '../user-abstract.repository';
import { Model } from 'mongoose';
import { User } from '../user.schema';
import { UserAdapter } from '../user.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMongooseRepository implements UserAdapter {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  findAll(page: number = 1, limit: number = 10): Promise<any[]> {
    return this.userModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
  }
  findOne(username: string): Promise<any> {
    return this.userModel.findOne({ username });
  }
  create(userObj: any): Promise<any> {
    return this.userModel.create(userObj);
  }
  update(userObj: any): Promise<any> {
    return this.userModel.updateOne(userObj);
  }
  delete(id: string): Promise<any> {
    return this.userModel.deleteOne({ _id: id });
  }
}
