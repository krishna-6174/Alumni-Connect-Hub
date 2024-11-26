import { Response, Request, NextFunction } from "express";
import md5 from "md5";
import pool from "../services/db";
// import * as logger from "../services/logger";
import { secret } from "../../config-local";
import { setMaxIdleHTTPParsers } from "http";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email:string;
  role: string;
}
// Middleware to verify the token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.auth_token;
    console.log("token in verify",token);
    console.log(!token);
    if (!token) {
        return res.status(201).json({ message: 'Unauthorized' });
    }else{
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
        (req as any).user = decoded; // Attaching the decoded user information to the request object
        console.log("user in verify",req.user);
        next();
    } catch (err) {
        console.log(err);
        return res.status(201).json({ message: 'Invalid token' });
    }
    }

}

// Middleware to validate user login
export async function isUserValid(req: Request, res: Response) {
  const { email, password } = req.body;
  console.log(email,password);
  try {
    // Query the user by email
    let [rows]: any[] = await pool.query('SELECT * FROM ADMINS WHERE email = ?', [email]);
    let role:string="admin";
    if (rows.length === 0) {
        console.log("rows  ----   ",rows.length);
         [rows]= await pool.query('SELECT * FROM ALUMNIS WHERE email = ?', [email]);
        role="alumni";
        if(rows.length===0){
            console.log("rows  ---- >>>  ",rows.length);
            return res.status(201).json({goAhead:true, message: 'Invalid email or password'})
        }
        console.log("rows  ----   ",rows.length);
        if(rows[0].status==='inactive'){//change later
            //console.log("rows  ---->>>   ",rows.length);
            return res.status(203).json({goAhead:false, message: "admin didn't approved you!!"});
        }
        // console.log("rows",rows.length);
    }
    //console.log("rows  ---->>>   ",rows.length);
    const user = rows[0];
    console.log(password,"   ",user.password);
    // Compare the provided password with the hashed password in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        return res.status(401).json({goAhead:false, message: 'Invalid email or password' });
    }
    // Password is correct, generate JWT token
    const token = jwt.sign({ id: role==="admin" ? user.adminid : user.id,email:user.email, role: role }, secret, { expiresIn: '7h' });
    console.log(token)
    // Set the token in an HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7*60 * 60 * 1000 // 7hours
  });
    console.log(user);
    return res.status(200).json({
      goAhead:true,
        message: 'Login successful',
        user: {
            id: role==="admin" ? user.adminid : user.id,
            email: user.email,
            name: user.name,
            role: role,
            profile:`http://192.168.139.5:6969/uploads/${user.profile}`
        },
    });
    
} catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
}
  
}