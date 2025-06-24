import bcrypt from 'bcryptjs';

export const hashPassword = async (password) =>{
    try {
        const hashedPwd = await bcrypt.hash(password,12);
        return hashedPwd;
    } catch (error) {
        console.log("Error while hashing pwd : ",hashedPwd);
    }
};