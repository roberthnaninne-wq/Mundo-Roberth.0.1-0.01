"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Database, Bot, Zap, RefreshCw, Check, AlertCircle, ArrowRight, Shield, Settings } from 'lucide-react';

interface SettingItem {
  id: number;
  setting_key: string;
  setting_value: any;
  scope: string;
  updated_at: string;
}

interface WorkflowProfile {
  id: number;
  workflow_key: string;
  display_name: string;
  is_enabled: boolean;
  prompt_profile: string;
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // System status
  const [systemStatus, setSystemStatus] = useState({
    database: 'checking',
    telegram: 'checking',
    openai: 'checking',
  });

  useEffect(() => {
    loadData();
    checkSystemStatus();
  }, []);

  async function loadData() {
    const supabase = createClient();

    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .order('setting_key');

    if (settingsData) setSettings(settingsData);

    const { data: workflowsData } = await supabase
      .from('workflow_profiles')
      .select('*')
      .order('workflow_key');

    if (workflowsData) setWorkflows(workflowsData);

    setLoading(false);
  }

  async function checkSystemStatus() {
    const supabase = createClient();

    const { error: dbError } = await supabase.from('jobs').select('id').limit(1);
    setSystemStatus(prev => ({
      ...prev,
      database: dbError ? 'error' : 'ok'
    }));

    setSystemStatus(prev => ({
      ...prev,
      telegram: 'ok',
      openai: 'ok'
    }));
  }

  async function toggleWorkflow(workflowId: number, currentState: boolean) {
    const supabase = createClient();

    const { error } = await supabase
      .from('workflow_profiles')
      .update({ is_enabled: !currentState })
      .eq('id', workflowId);

    if (!error) {
      setWorkflows(prev =>
        prev.map(w => w.id === workflowId ? { ...w, is_enabled: !currentState } : w)
      );
      showMessage('success', 'Workflow atualizado com sucesso!');
    } else {
      showMessage('error', 'Erro ao atualizar workflow');
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <section className="bg-black text-white py-20 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-4">
            Centro de Governo
          </p>
          <h1 className="text-4xl lg:text-5xl font-light mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            Configuracoes
          </h1>
          <p className="text-gray-400 max-w-xl">
            Configure prompts, workflows, integracoes e politicas do sistema.
          </p>
        </div>
      </section>

      {/* Toast Message */}
      {message && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-6 py-4 shadow-lg animate-fadeIn ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* System Status */}
      <section className="py-16 px-8 lg:px-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Status dos Sistemas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Database size={24} className="text-gray-400" />
                <span className="font-medium">Banco de Dados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  systemStatus.database === 'ok' ? 'bg-green-500' :
                  systemStatus.database === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'
                }`}></span>
                <span className="text-sm text-gray-500">
                  {systemStatus.database === 'ok' ? 'Online' :
                   systemStatus.database === 'error' ? 'Erro' : 'Verificando'}
                </span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Bot size={24} className="text-gray-400" />
                <span className="font-medium">Telegram Bot</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  systemStatus.telegram === 'ok' ? 'bg-green-500' :
                  systemStatus.telegram === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'
                }`}></span>
                <span className="text-sm text-gray-500">
                  {systemStatus.telegram === 'ok' ? 'Online' :
                   systemStatus.telegram === 'error' ? 'Erro' : 'Verificando'}
                </span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Zap size={24} className="text-gray-400" />
                <span className="font-medium">OpenAI GPT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  systemStatus.openai === 'ok' ? 'bg-green-500' :
                  systemStatus.openai === 'error' ? 'bg-red-500' : 'bg-gray-400 animate-pulse'
                }`}></span>
                <span className="text-sm text-gray-500">
                  {systemStatus.openai === 'ok' ? 'Online' :
                   systemStatus.openai === 'error' ? 'Erro' : 'Verificando'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Profiles */}
      <section className="py-16 px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Perfis de Workflow
          </h2>
          {workflows.length > 0 ? (
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="border border-gray-200 p-6 flex items-center justify-between hover:border-black transition-all"
                >
                  <div>
                    <h3 className="font-medium mb-1">{workflow.display_name}</h3>
                    <p className="text-sm text-gray-500">{workflow.workflow_key}</p>
                  </div>
                  <button
                    onClick={() => toggleWorkflow(workflow.id, workflow.is_enabled)}
                    className={`relative w-14 h-7 rounded-full transition-all ${
                      workflow.is_enabled ? 'bg-black' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                      workflow.is_enabled ? 'left-8' : 'left-1'
                    }`}></span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-gray-200">
              <Settings size={32} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Nenhum perfil de workflow configurado</p>
            </div>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="py-16 px-8 lg:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Configuracoes do Sistema
          </h2>
          {settings.length > 0 ? (
            <div className="space-y-4">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="bg-white border border-gray-200 p-6 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium mb-1">{setting.setting_key}</h3>
                    <p className="text-xs text-gray-500">
                      Escopo: {setting.scope} | Atualizado: {new Date(setting.updated_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <code className="text-sm bg-gray-100 px-4 py-2 text-gray-700 max-w-[300px] truncate">
                    {JSON.stringify(setting.setting_value)}
                  </code>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-gray-200">
              <Shield size={32} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Nenhuma configuracao definida</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-8 lg:px-16 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl mb-8" style={{ fontFamily: 'var(--font-serif)' }}>
            Acoes Rapidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="border border-gray-200 p-6 text-left hover:border-black transition-all group">
              <RefreshCw className="text-gray-400 mb-4 group-hover:rotate-180 transition-transform duration-500" size={24} />
              <h3 className="font-medium mb-1">Sincronizar</h3>
              <p className="text-xs text-gray-500">Atualizar dados do sistema</p>
            </button>
            <button className="border border-gray-200 p-6 text-left hover:border-black transition-all group">
              <Bot className="text-gray-400 mb-4" size={24} />
              <h3 className="font-medium mb-1">Testar Bot</h3>
              <p className="text-xs text-gray-500">Verificar conexao do Telegram</p>
            </button>
            <button className="border border-gray-200 p-6 text-left hover:border-black transition-all group">
              <Database className="text-gray-400 mb-4" size={24} />
              <h3 className="font-medium mb-1">Backup</h3>
              <p className="text-xs text-gray-500">Exportar dados do sistema</p>
            </button>
            <button className="border border-gray-200 p-6 text-left hover:border-black transition-all group">
              <Shield className="text-gray-400 mb-4" size={24} />
              <h3 className="font-medium mb-1">Auditoria</h3>
              <p className="text-xs text-gray-500">Ver logs de seguranca</p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
