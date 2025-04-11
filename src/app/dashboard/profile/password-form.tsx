'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/lib/toast';
import { useAuth } from '@/contexts/auth-context';
import { changePassword } from '@/services/userService';
import { useRouter } from 'next/navigation';

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: 'A senha atual é obrigatória.',
  }),
  newPassword: z.string().min(8, {
    message: 'A nova senha deve ter pelo menos 8 caracteres.',
  }),
  confirmPassword: z.string().min(1, {
    message: 'A confirmação de senha é obrigatória.',
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { tokens } = useAuth();
  const router = useRouter();
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    if (!tokens?.accessToken) {
      toast('Você precisa estar autenticado para alterar sua senha.', { type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await changePassword(tokens.accessToken, {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      // Reset form after successful password change
      form.reset();

      toast('Sua senha foi alterada com sucesso.', { type: 'success' });
      router.push('/dashboard/profile');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast(error.message || 'Algo deu errado. Por favor, tente novamente.', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha atual</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" placeholder="Digite sua senha atual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" placeholder="Digite sua nova senha" {...field} />
              </FormControl>
              <FormDescription>
                A senha deve ter pelo menos 8 caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" placeholder="Confirme sua nova senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer" disabled={isLoading}>
          {isLoading ? 'Alterando senha...' : 'Alterar senha'}
        </Button>
      </form>
    </Form>
  );
} 