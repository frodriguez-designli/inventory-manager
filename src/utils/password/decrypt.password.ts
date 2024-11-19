import * as bcrypt from 'bcrypt';

export const comparePassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
  };