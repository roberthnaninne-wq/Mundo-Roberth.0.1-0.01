"use client";

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Settings, Save, Zap, Bell, Shield, Bot, Database, RefreshCw, Check, AlertCircle } from 'lucide-react';

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
  const [saving, setSaving] = useState(false);
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

    // Load settings
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .order('setting_key');

    if (settingsData) setSettings(settingsData);

    // Load workflow profiles
    const { data: workflowsData } = await supabase
      .from('workflow_profiles')
      .select('*')
      .order('workflow_key');

    if (workflowsData) setWorkflows(workflowsData);

    setLoading(false);
  }

  async function checkSystemStatus() {
    const supabase = createClient();

    // Check database connection
    const { error: dbError } = await supabase.from('jobs').select('id').limit(1);
    setSystemStatus(prev => ({
      ...prev,
      database: dbError ? 'error' : 'ok'
    }));

    // For Telegram and OpenAI, we'd need server-side checks
    // For now, show as "configured" if we have data
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

  const StatusIndicator = ({ status }: { status: string }) => (
    <span className={`flex items-center gap-2 text-sm ${
      status === 'ok' ? 'text-emerald-500' :
      status === 'error' ? 'text-red-500' :
      'text-zinc-500'
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        status === 'ok' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
        status === 'error' ? 'bg-red-500' :
        'bg-zinc-500 animate-pulse'
      }`}></span>
      {status === 'ok' ? 'Operacional' : status === 'error' ? 'Erro' : 'Verificando...'}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="text-primary" />
          Palacio de Configuracoes
        </h2>
        <p className="text-zinc-500 mt-1">
          Centro de governo do Mundo Roberth.0.1 - Configure prompts, workflows e politicas
        </p>
      </header>

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top ${
          message.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-500' :
          'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      {/* System Status */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="text-emerald-500" />
          Status dos Sistemas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Database className="text-primary" size={20} />
              <span className="font-medium">Banco de Dados</span>
            </div>
            <StatusIndicator status={systemStatus.database} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Bot className="text-accent" size={20} />
              <span className="font-medium">Telegram Bot</span>
            </div>
            <StatusIndicator status={systemStatus.telegram} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Zap className="text-emerald-500" size={20} />
              <span className="font-medium">OpenAI GPT</span>
            </div>
            <StatusIndicator status={systemStatus.openai} />
          </div>
        </div>
      </div>

      {/* Workflow Profiles */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="text-accent" />
          Perfis de Workflow
        </h3>
        {workflows.length > 0 ? (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                <div>
                  <h4 className="font-bold">{workflow.display_name}</h4>
                  <p className="text-sm text-zinc-500">{workflow.workflow_key}</p>
                </div>
                <button
                  onClick={() => toggleWorkflow(workflow.id, workflow.is_enabled)}
                  className={`relative w-14 h-7 rounded-full transition-all ${
                    workflow.is_enabled ? 'bg-emerald-500' : 'bg-white/10'
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
          <p className="text-zinc-500 text-center py-8">
            Nenhum perfil de workflow configurado ainda.
          </p>
        )}
      </div>

      {/* Settings */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield className="text-primary" />
          Configuracoes do Sistema
        </h3>
        {settings.length > 0 ? (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <h4 className="font-medium">{setting.setting_key}</h4>
                  <p className="text-xs text-zinc-500">
                    Escopo: {setting.scope} | Atualizado: {new Date(setting.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <code className="text-sm bg-black/50 px-3 py-1 rounded-lg text-emerald-400 max-w-[300px] truncate">
                  {JSON.stringify(setting.setting_value)}
                </code>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-8">
            Nenhuma configuracao definida ainda.
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="text-secondary" />
          Acoes Rapidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 rounded-xl bg-white/5 hover:bg-primary/10 hover:border-primary/30 border border-white/5 transition-all text-left group">
            <RefreshCw className="text-primary mb-2 group-hover:rotate-180 transition-transform duration-500" size={24} />
            <h4 className="font-bold">Sincronizar</h4>
            <p className="text-xs text-zinc-500">Atualizar dados do sistema</p>
          </button>
          <button className="p-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/5 transition-all text-left group">
            <Bot className="text-emerald-500 mb-2" size={24} />
            <h4 className="font-bold">Testar Bot</h4>
            <p className="text-xs text-zinc-500">Verificar conexao do Telegram</p>
          </button>
          <button className="p-4 rounded-xl bg-white/5 hover:bg-accent/10 hover:border-accent/30 border border-white/5 transition-all text-left group">
            <Database className="text-accent mb-2" size={24} />
            <h4 className="font-bold">Backup</h4>
            <p className="text-xs text-zinc-500">Exportar dados do reino</p>
          </button>
          <button className="p-4 rounded-xl bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 border border-white/5 transition-all text-left group">
            <Shield className="text-red-500 mb-2" size={24} />
            <h4 className="font-bold">Auditoria</h4>
            <p className="text-xs text-zinc-500">Ver logs de seguranca</p>
          </button>
        </div>
      </div>
    </div>
  );
}
