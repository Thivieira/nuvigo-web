'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PatternFormat } from 'react-number-format';
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
import { getCurrentUser, updateUserProfile } from '@/services/userService';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor, insira um endereço de e-mail válido.',
  }),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { tokens } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!tokens?.accessToken) {
        setIsFetching(false);
        return;
      }

      try {
        const userData = await getCurrentUser(tokens.accessToken);
        form.reset({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast('Não foi possível carregar os dados do perfil.', { type: 'error' });
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, [form, tokens]);

  async function onSubmit(data: ProfileFormValues) {
    if (!tokens?.accessToken) {
      toast('Você precisa estar autenticado para atualizar seu perfil.', { type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile(tokens.accessToken, {
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      toast('Seu perfil foi atualizado com sucesso.', { type: 'success' });
    } catch (error: any) {
      console.error('Error updating profile:', error);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} disabled={isFetching} />
              </FormControl>
              <FormDescription>
                Este é seu nome de exibição público.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input disabled placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormDescription>
                Seu endereço de e-mail para notificações.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <PatternFormat
                  customInput={Input}
                  format="(##) #####-####"
                  mask="_"
                  placeholder="(00) 00000-0000"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values.value);
                  }}
                  disabled={isFetching}
                />
              </FormControl>
              <FormDescription>
                Seu número de telefone de contato.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="cursor-pointer" disabled={isLoading || isFetching}>
          {isLoading ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  );
} 