export interface UserAdapter {
  findAll(page?: number, limit?: number): Promise<any[]>;
  findOne(username: string): Promise<any>;
  create(userObj: any): Promise<any>;
  update(userObj: any): Promise<any>;
  delete(id: string): Promise<any>;
}
