import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, TestTube2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your equipment dashboard
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <AuthForm 
                mode="login" 
                mutation={loginMutation} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <AuthForm 
                mode="register" 
                mutation={registerMutation} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right: Hero */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-900 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-lg mx-auto text-white">
          <TestTube2 className="h-16 w-16 mb-8 text-primary" />
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Advanced Analytics for Chemical Engineering
          </h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Visualize flow rates, pressure differentials, and temperature gradients across your entire equipment fleet. 
            Upload CSV data and get instant insights.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Real-time Visualization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Statistical Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Historical Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Secure Storage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ mode, mutation }: { mode: "login" | "register", mutation: any }) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="jdoe" {...field} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} className="h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full h-11 text-base font-medium mt-6"
          disabled={mutation.isPending}
        >
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>
    </Form>
  );
}
