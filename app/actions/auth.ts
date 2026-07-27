"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAction(data: LoginInput) {
  try {
    const validatedFields = loginSchema.safeParse(data);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { email, password } = validatedFields.data;

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: "Logged in successfully!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function registerAction(data: RegisterInput) {
  try {
    const validatedFields = registerSchema.safeParse(data);
    if (!validatedFields.success) {
      return { error: "Invalid fields" };
    }

    const { email, password, name, role } = validatedFields.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already in use." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "BUILDER") {
      await prisma.builder.create({
        data: {
          userId: user.id,
          name: user.name,
          slug: user.name.toLowerCase().replace(/ /g, "-") + "-" + user.id.slice(0, 5),
        }
      });
    } else if (role === "BROKER") {
      await prisma.broker.create({
        data: {
          userId: user.id,
          companyName: user.name,
        }
      });
    }

    return { success: "User created!" };
  } catch (error) {
    return { error: "Something went wrong during registration." };
  }
}

export async function logoutAction() {
  await signOut({ redirect: true, redirectTo: "/" });
}
