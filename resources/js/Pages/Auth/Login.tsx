import {FormEventHandler, useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, Lock, Mail } from 'lucide-react'
import {Head, useForm} from "@inertiajs/react";
import InputError from "@/components/InputError";

export default function Login({status, canResetPassword} : {
    status?: string;
    canResetPassword: boolean;
}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        post(route('login'), {
            onFinish: () => {
                reset('password');
            },
            onError: ()=>{
                setIsLoading(false);
            }
        });
    }

    return (
        <div className="flex min-h-screen bg-gray-100 md:flex-row">

            <Head title="Iniciar sessão" />


            {/* Seção de boas-vindas */}

            <div className="flex-col items-center justify-center hidden p-8 text-white bg-primary md:w-1/2 sm:flex">
                <h1 className="mb-4 text-4xl font-bold">Bem-vindo a RM</h1>
                <p className="mb-8 text-xl text-center">
                    Faça login para acessar o painel administrativo da empresa
                </p>
            </div>

            {/* Formulário de login */}
            <div className="flex items-center justify-center p-8 md:w-1/2">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold">Login Corporativo</CardTitle>
                        <CardDescription>
                            Entre com suas credenciais para acessar o painel
                        </CardDescription>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <Input
                                        id="email"
                                        placeholder="email@exemplo.com"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={"Palavra passe"}
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    checked={Boolean(data.remember)}
                                    onCheckedChange={(checked)=>{
                                        setData('remember', checked as any)
                                    }}
                                    id="remember"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Lembrar-me
                                </label>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <>
                                        Entrar <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                            <a href="#" className="text-sm text-primary hover:underline">
                                Esqueceu sua senha?
                            </a>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
