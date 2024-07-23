import { z } from 'zod';

// Define the schema for the form
const SignUpuserSchema = z.object({
  FirstName: z.string().min(2, { message: "First name should be atlest 2 characters long" }).max(10,{ message: "First name should not be more than 10 characters" }),
  LastName: z.string().min(2, { message: "Last name should be atlest 2 characters long" }).max(10,{ message: "Last name should not be more than 10 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" })
});

export default SignUpuserSchema;
