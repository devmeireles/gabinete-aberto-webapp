import React from "react";
import { ExternalLink, ShieldCheck, Database, Calendar } from "lucide-react";
import { cacheLife } from "next/cache";

export const Footer: React.FC = async () => {
  async function getCurrentYear(): Promise<number> {
    "use cache";
    cacheLife("weeks");
    return new Date().getFullYear();
  }

  return (
    <footer className="mt-16 border-t border-border bg-surface text-xs text-text-muted">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-2 text-sm font-semibold text-text">
              Dados Abertos da Câmara dos Deputados
            </div>
            <p className="leading-relaxed">
              Plataforma pública para acompanhamento, consulta e fiscalização
              cidadã da Cota para o Exercício da Atividade Parlamentar (CEAP),
              perfis e histórico partidário dos deputados federais.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text">
              <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Periodicidade e Origem</span>
            </div>
            <p className="leading-relaxed">
              Os dados de despesas são sincronizados automaticamente aos{" "}
              <strong>domingos às 03h00 (Brasília)</strong>, abrangendo os três
              meses mais recentes de acordo com a política de publicação da
              Câmara.
            </p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-text-subtle">
              <ShieldCheck
                className="h-3.5 w-3.5 text-success"
                aria-hidden="true"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-text">
              <Database className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>Fontes Oficiais</span>
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://dadosabertos.camara.leg.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-link hover:text-link-hover hover:underline"
                >
                  <span>Portal de Dados Abertos da Câmara</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://dadosabertos.camara.leg.br/swagger/api.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-link hover:text-link-hover hover:underline"
                >
                  <span>Documentação da API v2 (Swagger)</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.camara.leg.br/transparencia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-link hover:text-link-hover hover:underline"
                >
                  <span>Portal da Transparência da Câmara</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 text-[11px] text-text-subtle sm:flex-row">
          <div>
            © {getCurrentYear()} Dados Abertos da Câmara dos Deputados · Uso
            público sem fins comerciais
          </div>
          <div>
            Datas em formato brasileiro (dd/MM/yyyy) · Valores em Reais (R$)
          </div>
        </div>
      </div>
    </footer>
  );
};
