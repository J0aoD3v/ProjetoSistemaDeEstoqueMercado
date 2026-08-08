'use client';

import { useEffect, useState, useCallback } from 'react';
import { Produto } from '@/types';
import { produtoService } from '@/services/produtoService';
import { Plus, Trash2, Edit, PackageCheck, AlertCircle, X, Check } from 'lucide-react';
import axios from 'axios';
import { validarSKU, validarCodigoBarras, validarCampoObrigatorio } from '@/utils/validators';

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroGeral, setErroGeral] = useState('');

  const [sku, setSku] = useState('');
  const [codigoBarras, setCodigoBarras] = useState('');
  const [descricao, setDescricao] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState('UN');
  const [statusAtivo, setStatusAtivo] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const [erroSku, setErroSku] = useState('');
  const [erroCodigoBarras, setErroCodigoBarras] = useState('');
  const [erroDescricao, setErroDescricao] = useState('');
  const [erroUnidadeMedida, setErroUnidadeMedida] = useState('');

  const [editSku, setEditSku] = useState('');
  const [editCodigoBarras, setEditCodigoBarras] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editUnidadeMedida, setEditUnidadeMedida] = useState('UN');
  const [editStatusAtivo, setEditStatusAtivo] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [editErroSku, setEditErroSku] = useState('');
  const [editErroCodigoBarras, setEditErroCodigoBarras] = useState('');
  const [editErroDescricao, setEditErroDescricao] = useState('');
  const [editErroUnidadeMedida, setEditErroUnidadeMedida] = useState('');

  const carregarProdutos = useCallback(async () => {
    try {
      setCarregando(true);
      const data = await produtoService.listarTodos();
      setProdutos(data);
      setErroGeral('');
    } catch {
      setErroGeral('Não foi possível conectar ao servidor backend.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await carregarProdutos();
    })();
  }, [carregarProdutos]);

  const validarFormularioCadastro = (): boolean => {
    let isValid = true;

    const erroSkuValidacao = validarSKU(sku);
    if (erroSkuValidacao) {
      setErroSku(erroSkuValidacao);
      isValid = false;
    } else {
      setErroSku('');
    }

    const erroCodigoBarrasValidacao = validarCodigoBarras(codigoBarras);
    if (erroCodigoBarrasValidacao) {
      setErroCodigoBarras(erroCodigoBarrasValidacao);
      isValid = false;
    } else {
      setErroCodigoBarras('');
    }

    const erroDescricaoValidacao = validarCampoObrigatorio(descricao, 'Descrição');
    if (erroDescricaoValidacao) {
      setErroDescricao(erroDescricaoValidacao);
      isValid = false;
    } else {
      setErroDescricao('');
    }

    const erroUnidadeMedidaValidacao = validarCampoObrigatorio(unidadeMedida, 'Unidade de Medida');
    if (erroUnidadeMedidaValidacao) {
      setErroUnidadeMedida(erroUnidadeMedidaValidacao);
      isValid = false;
    } else {
      setErroUnidadeMedida('');
    }

    return isValid;
  };

  const validarFormularioEdicao = (): boolean => {
    let isValid = true;

    const erroSkuValidacao = validarSKU(editSku);
    if (erroSkuValidacao) {
      setEditErroSku(erroSkuValidacao);
      isValid = false;
    } else {
      setEditErroSku('');
    }

    const erroCodigoBarrasValidacao = validarCodigoBarras(editCodigoBarras);
    if (erroCodigoBarrasValidacao) {
      setEditErroCodigoBarras(erroCodigoBarrasValidacao);
      isValid = false;
    } else {
      setEditErroCodigoBarras('');
    }

    const erroDescricaoValidacao = validarCampoObrigatorio(editDescricao, 'Descrição');
    if (erroDescricaoValidacao) {
      setEditErroDescricao(erroDescricaoValidacao);
      isValid = false;
    } else {
      setEditErroDescricao('');
    }

    const erroUnidadeMedidaValidacao = validarCampoObrigatorio(editUnidadeMedida, 'Unidade de Medida');
    if (erroUnidadeMedidaValidacao) {
      setEditErroUnidadeMedida(erroUnidadeMedidaValidacao);
      isValid = false;
    } else {
      setEditErroUnidadeMedida('');
    }

    return isValid;
  };

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormularioCadastro()) {
      return;
    }

    try {
      await produtoService.cadastrar({
        sku,
        codigoBarras,
        descricao,
        unidadeMedida,
        statusAtivo,
      });

      setSku('');
      setCodigoBarras('');
      setDescricao('');
      setMostrarForm(false);
      setErroSku('');
      setErroCodigoBarras('');
      setErroDescricao('');
      setErroUnidadeMedida('');
      await carregarProdutos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const mensagem = err.response.data.mensagem.toLowerCase();
        if (mensagem.includes('sku')) {
          setErroSku(err.response.data.mensagem);
        } else if (mensagem.includes('código') || mensagem.includes('barras')) {
          setErroCodigoBarras(err.response.data.mensagem);
        } else if (mensagem.includes('descrição')) {
          setErroDescricao(err.response.data.mensagem);
        } else if (mensagem.includes('unidade')) {
          setErroUnidadeMedida(err.response.data.mensagem);
        } else {
          setErroGeral(err.response.data.mensagem);
        }
      } else {
        setErroGeral('Erro ao cadastrar produto.');
      }
    }
  };

  const handleExcluir = async (id?: number) => {
    if (!id || !confirm('Deseja realmente excluir este produto?')) return;
    try {
      await produtoService.excluir(id);
      await carregarProdutos();
    } catch {
      setErroGeral('Erro ao excluir produto.');
    }
  };

  const iniciarEdicao = (p: Produto) => {
    setEditandoId(p.idProduto ?? null);
    setEditSku(p.sku);
    setEditCodigoBarras(p.codigoBarras);
    setEditDescricao(p.descricao);
    setEditUnidadeMedida(p.unidadeMedida);
    setEditStatusAtivo(p.statusAtivo);
    setEditErroSku('');
    setEditErroCodigoBarras('');
    setEditErroDescricao('');
    setEditErroUnidadeMedida('');
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditSku('');
    setEditCodigoBarras('');
    setEditDescricao('');
    setEditUnidadeMedida('UN');
    setEditStatusAtivo(true);
    setEditErroSku('');
    setEditErroCodigoBarras('');
    setEditErroDescricao('');
    setEditErroUnidadeMedida('');
  };

  const salvarEdicao = async (id: number) => {
    if (!validarFormularioEdicao()) {
      return;
    }

    try {
      await produtoService.atualizar(id, {
        sku: editSku,
        codigoBarras: editCodigoBarras,
        descricao: editDescricao,
        unidadeMedida: editUnidadeMedida,
        statusAtivo: editStatusAtivo,
      });
      cancelarEdicao();
      await carregarProdutos();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.mensagem) {
        const mensagem = err.response.data.mensagem.toLowerCase();
        if (mensagem.includes('sku')) {
          setEditErroSku(err.response.data.mensagem);
        } else if (mensagem.includes('código') || mensagem.includes('barras')) {
          setEditErroCodigoBarras(err.response.data.mensagem);
        } else if (mensagem.includes('descrição')) {
          setEditErroDescricao(err.response.data.mensagem);
        } else if (mensagem.includes('unidade')) {
          setEditErroUnidadeMedida(err.response.data.mensagem);
        } else {
          setErroGeral(err.response.data.mensagem);
        }
      } else {
        setErroGeral('Erro ao atualizar produto.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Cadastro de Produtos
          </h1>
          <p className="mt-1 text-base text-muted">
            Gerencie os itens do catálogo do mercado
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent-hover"
        >
          <Plus className="w-4 h-4" />
          {mostrarForm ? 'Fechar Formulário' : 'Novo Produto'}
        </button>
      </div>

      {erroGeral && (
        <div className="flex items-center gap-3 rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          <AlertCircle className="w-5 h-5" />
          {erroGeral}
        </div>
      )}

      {mostrarForm && (
        <form
          onSubmit={handleCadastrar}
          className="space-y-5 rounded-2xl border border-border bg-background p-6 shadow-sm"
        >
          <h2 className="border-b border-border pb-2 text-lg font-semibold text-foreground">Novo Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">SKU</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => {
                  const raw = e.target.value;
                  setSku(raw.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
                  setErroSku(/[^A-Za-z0-9-]/.test(raw) ? 'Digite apenas letras, números e hífen.' : '');
                }}
                onBlur={() => {
                  const erro = validarSKU(sku);
                  if (erro) setErroSku(erro);
                }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent ${erroSku ? 'border-danger' : 'border-border'}`}
                placeholder="PROD-001"
              />
              {erroSku && <p className="text-xs text-danger mt-1">{erroSku}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Código de Barras</label>
              <input
                type="text"
                required
                value={codigoBarras}
                onChange={(e) => {
                  const raw = e.target.value;
                  const limpo = raw.replace(/\D/g, '');
                  setCodigoBarras(limpo);
                  setErroCodigoBarras(raw !== limpo ? 'Digite apenas números.' : '');
                }}
                onBlur={() => {
                  const erro = validarCodigoBarras(codigoBarras);
                  if (erro) setErroCodigoBarras(erro);
                }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent ${erroCodigoBarras ? 'border-danger' : 'border-border'}`}
                placeholder="7891234567890"
              />
              {erroCodigoBarras && <p className="text-xs text-danger mt-1">{erroCodigoBarras}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-foreground">Unidade de Medida</label>
              <select
                value={unidadeMedida}
                onChange={(e) => {
                  setUnidadeMedida(e.target.value);
                  if (erroUnidadeMedida) setErroUnidadeMedida('');
                }}
                onBlur={() => {
                  const erro = validarCampoObrigatorio(unidadeMedida, 'Unidade de Medida');
                  if (erro) setErroUnidadeMedida(erro);
                }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent ${erroUnidadeMedida ? 'border-danger' : 'border-border'}`}
              >
                <option value="UN">Unidade (UN)</option>
                <option value="KG">Quilograma (KG)</option>
                <option value="CX">Caixa (CX)</option>
                <option value="LT">Litro (LT)</option>
              </select>
              {erroUnidadeMedida && <p className="text-xs text-danger mt-1">{erroUnidadeMedida}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-foreground">Descrição</label>
              <input
                type="text"
                required
                value={descricao}
                onChange={(e) => {
                  setDescricao(e.target.value);
                  if (erroDescricao) setErroDescricao('');
                }}
                onBlur={() => {
                  const erro = validarCampoObrigatorio(descricao, 'Descrição');
                  if (erro) setErroDescricao(erro);
                }}
                className={`w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent ${erroDescricao ? 'border-danger' : 'border-border'}`}
                placeholder="Arroz Tipo 1 - 5kg"
              />
              {erroDescricao && <p className="text-xs text-danger mt-1">{erroDescricao}</p>}
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="statusAtivo"
                checked={statusAtivo}
                onChange={(e) => setStatusAtivo(e.target.checked)}
                className="h-4 w-4 rounded text-accent"
              />
              <label htmlFor="statusAtivo" className="text-sm font-medium text-foreground">Ativo para Venda</label>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent-hover"
            >
              Salvar Produto
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {carregando ? (
          <div className="p-8 text-center text-muted">Carregando catálogo de produtos...</div>
        ) : produtos.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-8 text-center text-muted">
            <PackageCheck className="w-10 h-10 text-muted " />
            Nenhum produto cadastrado no momento.
          </div>
        ) : (
          <table className="w-full min-w-190 border-collapse text-left text-base">
            <thead className="border-b border-border bg-surface text-xs font-bold uppercase tracking-wider text-foreground">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Cód. Barras</th>
                <th className="p-4">Descrição</th>
                <th className="p-4">UN</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {produtos.map((p) => (
                <tr key={p.idProduto} className="transition-colors hover:bg-surface-hover">
                  {editandoId === p.idProduto ? (
                    <>
                      <td className="p-4 font-mono text-muted">#{p.idProduto}</td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editSku}
                          onChange={(e) => {
                            const raw = e.target.value;
                            setEditSku(raw.toUpperCase().replace(/[^A-Z0-9-]/g, ''));
                            setEditErroSku(/[^A-Za-z0-9-]/.test(raw) ? 'Digite apenas letras, números e hífen.' : '');
                          }}
                          onBlur={() => {
                            const erro = validarSKU(editSku);
                            if (erro) setEditErroSku(erro);
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroSku ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroSku && <p className="text-xs text-danger mt-1">{editErroSku}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editCodigoBarras}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const limpo = raw.replace(/\D/g, '');
                            setEditCodigoBarras(limpo);
                            setEditErroCodigoBarras(raw !== limpo ? 'Digite apenas números.' : '');
                          }}
                          onBlur={() => {
                            const erro = validarCodigoBarras(editCodigoBarras);
                            if (erro) setEditErroCodigoBarras(erro);
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroCodigoBarras ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroCodigoBarras && <p className="text-xs text-danger mt-1">{editErroCodigoBarras}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editDescricao}
                          onChange={(e) => {
                            setEditDescricao(e.target.value);
                            if (editErroDescricao) setEditErroDescricao('');
                          }}
                          onBlur={() => {
                            const erro = validarCampoObrigatorio(editDescricao, 'Descrição');
                            if (erro) setEditErroDescricao(erro);
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroDescricao ? 'border-danger' : 'border-border'}`}
                        />
                        {editErroDescricao && <p className="text-xs text-danger mt-1">{editErroDescricao}</p>}
                      </td>
                      <td className="p-4">
                        <select
                          value={editUnidadeMedida}
                          onChange={(e) => {
                            setEditUnidadeMedida(e.target.value);
                            if (editErroUnidadeMedida) setEditErroUnidadeMedida('');
                          }}
                          onBlur={() => {
                            const erro = validarCampoObrigatorio(editUnidadeMedida, 'Unidade de Medida');
                            if (erro) setEditErroUnidadeMedida(erro);
                          }}
                          className={`w-full border rounded px-2 py-1 text-xs ${editErroUnidadeMedida ? 'border-danger' : 'border-border'}`}
                        >
                          <option value="UN">UN</option>
                          <option value="KG">KG</option>
                          <option value="CX">CX</option>
                          <option value="LT">LT</option>
                        </select>
                        {editErroUnidadeMedida && <p className="text-xs text-danger mt-1">{editErroUnidadeMedida}</p>}
                      </td>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={editStatusAtivo}
                          onChange={(e) => setEditStatusAtivo(e.target.checked)}
                          className="h-4 w-4 rounded text-accent"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => salvarEdicao(p.idProduto!)} className="text-muted hover:text-accent p-1 mr-1">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={cancelarEdicao} className="text-muted p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 font-mono text-muted">#{p.idProduto}</td>
                      <td className="p-4 font-medium text-foreground">{p.sku}</td>
                      <td className="p-4 font-mono text-muted">{p.codigoBarras}</td>
                      <td className="p-4 text-foreground">{p.descricao}</td>
                      <td className="p-4 text-foreground">{p.unidadeMedida}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.statusAtivo
                              ? 'bg-accent/20 text-accent'
                              : 'bg-danger/20 text-danger'
                          }`}
                        >
                          {p.statusAtivo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => iniciarEdicao(p)}
                          className="rounded-md p-1 text-muted transition-colors hover:text-accent  mr-1"
                          title="Editar Produto"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleExcluir(p.idProduto)}
                          className="rounded-md p-1 text-muted transition-colors hover:text-danger "
                          title="Excluir Produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
