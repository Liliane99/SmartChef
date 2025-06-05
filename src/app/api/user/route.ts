import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; 

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AITABLE_TABLE_USERS, JWT_SECRET } = process.env;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AITABLE_TABLE_USERS}`;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    
    const res = await fetch(`${AIRTABLE_API_URL}?filterByFormula=({email}="${email}")`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });
    
    const data = await res.json();
    const record = data.records[0];

    if (!record) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = record.fields;

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ id: record.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      path: "/", 
      maxAge: 60 * 60 * 24, 
    });
    

    return NextResponse.json({ message: "Login successful",  token });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("token");
  
      if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
  
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
  
      
      jwt.verify(token.value, JWT_SECRET);
  
      
      const res = await fetch(AIRTABLE_API_URL, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        },
      });
  
      if (!res.ok) {
        return NextResponse.json({ error: "Failed to fetch users from Airtable" }, { status: res.status });
      }
  
      const data = await res.json();
  
      
      return NextResponse.json({ users: data.records });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  