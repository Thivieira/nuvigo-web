'use client';

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProfileForm } from './profile-form';
import { PasswordForm } from './password-form';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o Dashboard
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Perfil</CardTitle>
          <CardDescription>
            Gerencie suas configurações e preferências de conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="cursor-pointer" value="profile">Perfil</TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="password">Senha</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="password">
              <PasswordForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 