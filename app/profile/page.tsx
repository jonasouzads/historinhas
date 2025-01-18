'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import toast from 'react-hot-toast';
import type { Database } from '@/lib/supabase';

export default function ProfilePage() {
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedName, setEditedName] = useState('');
  const supabase = createClientComponentClient<Database>();

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || '');

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFullName(profile.full_name || '');
        setEditedName(profile.full_name || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdateName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editedName })
        .eq('id', user.id);

      if (error) throw error;

      setFullName(editedName);
      setIsEditing(false);
      toast.success('Nome atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Erro ao atualizar nome');
    }
  };

  const handleResetPassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Email de redefinição de senha enviado!');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Erro ao enviar email de redefinição');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Informações Pessoais */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
            {fullName ? fullName[0].toUpperCase() : '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
            <p className="text-sm text-gray-500">Gerencie seus dados pessoais</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
                <button
                  onClick={handleUpdateName}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedName(fullName);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-900">{fullName || 'Não informado'}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Editar
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-lg text-gray-900">{email}</p>
          </div>
        </div>
      </div>

      {/* Segurança */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center text-2xl">
            🔒
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Segurança</h2>
            <p className="text-sm text-gray-500">Gerencie sua senha e segurança</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Alterar Senha</h3>
            <p className="text-sm text-gray-500 mb-4">
              Enviaremos um email com instruções para alterar sua senha.
            </p>
            <button
              onClick={handleResetPassword}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Solicitar Alteração de Senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
