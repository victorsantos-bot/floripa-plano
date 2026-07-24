import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

function LoginModal({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (err) { setError("Email ou senha incorretos"); return; }
    onLogin(true);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(12,35,64,0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "white", borderRadius: 14, padding: 36, width: 380, maxWidth: "90vw", boxShadow: "0 25px 60px rgba(0,0,0,0.3)", textAlign: "center" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0C2340" }}>Acesso Administrativo</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#888" }}>Insira suas credenciais para editar o plano</p>
        </div>
        <div>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            placeholder="Email"
            style={{ width: "100%", padding: "12px 14px", border: error ? "2px solid #DC2626" : "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }}
            autoFocus
          />
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
            placeholder="Senha"
            style={{ width: "100%", padding: "12px 14px", border: error ? "2px solid #DC2626" : "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
          {error && <div style={{ fontSize: 12, color: "#DC2626", marginTop: 6 }}>{error}</div>}
          <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", marginTop: 14, padding: "11px 0", background: "#0C2340", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Entrando..." : "Entrar como Admin"}
          </button>
          <button onClick={() => onLogin(false)} style={{ width: "100%", marginTop: 8, padding: "10px 0", background: "transparent", color: "#888", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>
            Continuar apenas visualizando
          </button>
        </div>
      </div>
    </div>
  );
}

const AREAS_FIXAS = ["DEF", "DEI", "DIPED", "DGPE", "Gabinete", "DIAOP", "GFC"];
const LOGO_PMF = "data:image/png;base64,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";


const EIXOS = [
  {
    id: "aprendizagem",
    nome: "Aprendizagem e Desenvolvimento",
    cor: "#1F3D7A",
    corClaro: "#EEF2FA",
    diretrizes: [
      {
        id: "frequencia", nome: "Frequência e Permanência",
        meta2028: "Crianças e estudantes da Rede com ao menos 95% de frequência nas unidades educativas",
        marcos: [
          { id: "f1", ordem: 1, descricao: "Ajustes dos processos e ferramentas de lançamento e acompanhamento de frequência", responsavel: "DIPED", prazoOriginal: "Jul/25" },
          { id: "f2", ordem: 2, descricao: "Comunicação e formação dos profissionais do Ensino Fundamental sobre os novos processos e ferramentas", responsavel: "DEF", prazoOriginal: "Jul/25" },
          { id: "f3", ordem: 3, descricao: "Desenho e implementação do 'Campeonato de Frequência' para os estudantes", responsavel: "Gabinete", prazoOriginal: "Jul/25" },
          { id: "f4", ordem: 4, descricao: "Modelo de acompanhamento da movimentação de estudantes dentro e fora da Rede", responsavel: "Gabinete", prazoOriginal: "Ago/25" },
          { id: "f5", ordem: 5, descricao: "Adaptação dos processos e ferramentas de lançamento e acompanhamento de frequência para a Educação Infantil", responsavel: "DIPED e DEI", prazoOriginal: "Fev/26" },
        ]
      },
      {
        id: "inclusao", nome: "Inclusão e Equidade",
        meta2028: "Todas as crianças e estudantes da Rede com seu direito de aprendizagem e desenvolvimento assegurado",
        marcos: [
          { id: "i1", ordem: 1, descricao: "Estruturação de plano de letramento racial voltado para profissionais da Rede e famílias", responsavel: "DEF e DEI", prazoOriginal: "Set/25" },
          { id: "i2", ordem: 2, descricao: "Desenho de processo de atualização cadastral das crianças e estudantes matriculados na Rede", responsavel: "DIPED", prazoOriginal: "Fev/26" },
          { id: "i3", ordem: 3, descricao: "Aperfeiçoamento da formação continuada dos profissionais de apoio das crianças e estudantes com deficiência", responsavel: "DEE", prazoOriginal: "Dez/26" },
          { id: "i4", ordem: 4, descricao: "Construção da linha de base de diferença de aprendizagem entre grupos de equidade com base no 'Avalia Floripa'", responsavel: "DEF", prazoOriginal: "Dez/26" },
          { id: "i5", ordem: 5, descricao: "Divulgação dos resultados das avaliações internas com recortes de equidade", responsavel: "DEF e DEI", prazoOriginal: "Mar/27" },
          { id: "i6", ordem: 6, descricao: "Construção de cartilhas informativas sobre cuidados que transcendem o ambiente das UEs, com Saúde e Assist. Social", responsavel: "DEE", prazoOriginal: "Mai/27" },
          { id: "i7", ordem: 7, descricao: "Implementação de rotina de acompanhamento da Matriz Curricular de ERER no plano de aulas e atividades nas UEs", responsavel: "DEF e DEI", prazoOriginal: "Fev/28" },
        ]
      },
      {
        id: "gestao-pedagogica", nome: "Gestão Pedagógica",
        meta2028: "100% das UEs com Plano de Ação e metas estabelecidas e sendo acompanhadas por tutores ou assessores pedagógicos",
        marcos: [
          { id: "gp1", ordem: 1, descricao: "Reestruturação da tutoria pedagógica e seleção dos profissionais para realizar o acompanhamento", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "gp2", ordem: 2, descricao: "Definição das metas e foco de atuação das Unidades Educativas para 2025", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "gp3", ordem: 3, descricao: "Plano para implementação dos Parâmetros Nacionais de Qualidade da Educação Infantil na Rede", responsavel: "DEI", prazoOriginal: "Dez/25" },
          { id: "gp4", ordem: 4, descricao: "Definição das metas e foco de atuação das Unidades Educativas para 2026", responsavel: "DEF e DEI", prazoOriginal: "Mar/26" },
          { id: "gp5", ordem: 5, descricao: "Definição das metas e foco de atuação das Unidades Educativas para 2027", responsavel: "DEF e DEI", prazoOriginal: "Mar/27" },
          { id: "gp6", ordem: 6, descricao: "Definição das metas e foco de atuação das Unidades Educativas para 2028", responsavel: "DEF e DEI", prazoOriginal: "Mar/28" },
        ]
      },
      {
        id: "curriculo", nome: "Currículo",
        meta2028: "100% das Unidades Educativas de Ensino Fundamental utilizando o Currículo revisado da Etapa, alinhado à BNCC",
        marcos: [
          { id: "c1", ordem: 1, descricao: "Priorização da matriz curricular atual para todos os anos do Ensino Fundamental", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "c2", ordem: 2, descricao: "Revisão do Currículo de Ensino Fundamental de Florianópolis para alinhá-lo à BNCC e incorporar a matriz de ERER", responsavel: "DEF", prazoOriginal: "Dez/26" },
          { id: "c3", ordem: 3, descricao: "Definição de rotina de acompanhamento da implementação do currículo nas UEs", responsavel: "DEF", prazoOriginal: "Fev/27" },
          { id: "c4", ordem: 4, descricao: "Estruturação e implementação de formação continuada dos profissionais sobre currículo revisado", responsavel: "DEF", prazoOriginal: "Mar/27" },
        ]
      },
      {
        id: "material-pedagogico", nome: "Material Pedagógico",
        meta2028: "100% das turmas do Ensino Fundamental utilizando material pedagógico alinhado à BNCC",
        marcos: [
          { id: "mp1", ordem: 1, descricao: "Disponibilização de material pedagógico complementar para 1º, 2º, 5º e 9º anos do Ensino Fundamental", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "mp2", ordem: 2, descricao: "Disponibilização de material pedagógico complementar para o 4º ano", responsavel: "DEF", prazoOriginal: "Abr/26" },
          { id: "mp3", ordem: 3, descricao: "Disponibilização de material pedagógico complementar para todos os anos dos Anos Iniciais", responsavel: "DEF", prazoOriginal: "Abr/27" },
          { id: "mp4", ordem: 4, descricao: "Desenho e implementação de Trilhas formativas para os professores sobre o material pedagógico complementar", responsavel: "DEF", prazoOriginal: "Mai/27" },
          { id: "mp5", ordem: 5, descricao: "Revisão do material pedagógico de Florianópolis após desenho do novo currículo da Rede", responsavel: "DEF", prazoOriginal: "Jun/27" },
        ]
      },
      {
        id: "avaliacao", nome: "Avaliação",
        meta2028: "Ao menos 85% de participação dos estudantes no Avalia Floripa e implementação de avaliação de qualidade da Ed. Infantil",
        marcos: [
          { id: "av1", ordem: 1, descricao: "Estruturação do calendário de avaliações diagnósticas, formativas e somativas do 'Avalia Floripa' para 2025–2028", responsavel: "DEF", prazoOriginal: "Jul/25" },
          { id: "av2", ordem: 2, descricao: "Desenho e implementação do 'Estudante Floripa', programa de reconhecimento dos estudantes destaque nas avaliações", responsavel: "DEF", prazoOriginal: "Ago/25" },
          { id: "av3", ordem: 3, descricao: "Ações de engajamento das unidades com menos de 80% de participação nas avaliações internas", responsavel: "DEF", prazoOriginal: "Ago/25" },
          { id: "av4", ordem: 4, descricao: "Adesão ao Sistema de Avaliação Estadual de Santa Catarina (SAESC) e aplicação anual da prova", responsavel: "DEF", prazoOriginal: "Dez/25" },
          { id: "av5", ordem: 5, descricao: "Estruturação de plano de avaliação e monitoramento na EI para acompanhar a qualidade da oferta da etapa na Rede", responsavel: "DEI", prazoOriginal: "Fev/26" },
          { id: "av6", ordem: 6, descricao: "Execução e monitoramento das ações previstas do Avalia Floripa, Estudante Floripa e Avaliação do EI para 2026", responsavel: "DEF e DEI", prazoOriginal: "Dez/26" },
          { id: "av7", ordem: 7, descricao: "Execução e monitoramento das ações previstas do Avalia Floripa, Estudante Floripa e Avaliação do EI para 2027", responsavel: "DEF e DEI", prazoOriginal: "Dez/27" },
          { id: "av8", ordem: 8, descricao: "Execução e monitoramento das ações previstas do Avalia Floripa, Estudante Floripa e Avaliação do EI para 2028", responsavel: "DEF e DEI", prazoOriginal: "Dez/28" },
        ]
      },
      {
        id: "superacao-defasagens", nome: "Superação de Defasagens",
        meta2028: "Redução de 50% do número de estudantes da Rede em níveis insuficientes de aprendizagem",
        marcos: [
          { id: "sd1", ordem: 1, descricao: "Readequação do método de recomposição de aprendizagem, com utilização de reagrupamento por níveis", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "sd2", ordem: 2, descricao: "Orientação dos profissionais para efetiva implementação dos métodos de recomposição de aprendizagem", responsavel: "DEF", prazoOriginal: "Mai/25" },
          { id: "sd3", ordem: 3, descricao: "Disponibilização de material de correção de defasagem para 5º e 9º ano", responsavel: "DEF", prazoOriginal: "Jun/25" },
          { id: "sd4", ordem: 4, descricao: "Reestruturação do 'Apoio Pedagógico' para corrigir possíveis defasagens adquiridas pelos estudantes ao longo do ano", responsavel: "DEF", prazoOriginal: "Dez/25" },
          { id: "sd5", ordem: 5, descricao: "Disponibilização de material de correção de defasagem para 4º ano", responsavel: "DEF", prazoOriginal: "Fev/26" },
          { id: "sd6", ordem: 6, descricao: "Disponibilização de material de correção de defasagem para 3º ano", responsavel: "DEF", prazoOriginal: "Fev/27" },
        ]
      },
    ]
  },
  {
    id: "professores",
    nome: "Professores",
    cor: "#E8941A",
    corClaro: "#FEF6E8",
    diretrizes: [
      {
        id: "gestao-trabalho-docente", nome: "Gestão do Trabalho Docente",
        meta2028: "100% das Unidades Educativas com Profissionais suficientes",
        marcos: [
          { id: "gtd1", ordem: 1, descricao: "Estruturação de plano de estímulo à assiduidade dos professores nas unidades educativas (ex: gratificação)", responsavel: "Gabinete", prazoOriginal: "Jul/25" },
          { id: "gtd2", ordem: 2, descricao: "Estudo de aprimoramento dos normativos de composição das equipes gestoras e quadro docente nas UEs", responsavel: "DEF e DEI", prazoOriginal: "Set/25" },
          { id: "gtd3", ordem: 3, descricao: "Proposta de refinamento do processo seletivo de substitutos", responsavel: "DGPE", prazoOriginal: "Out/25" },
          { id: "gtd4", ordem: 4, descricao: "Estruturação e implementação de processos e ferramentas para tornar mais eficiente a lotação docente", responsavel: "DGPE", prazoOriginal: "Jan/26" },
          { id: "gtd5", ordem: 5, descricao: "Agenda de debates com a Secretaria de Administração sobre as regras de afastamento dos Servidores", responsavel: "Gabinete", prazoOriginal: "Jun/26" },
        ]
      },
      {
        id: "carreira-docente", nome: "Carreira Docente",
        meta2028: "Desenho da proposta do Plano de Carreira Docente",
        marcos: [
          { id: "cd1", ordem: 1, descricao: "Aprofundamento no diagnóstico das principais oportunidades de melhoria da carreira", responsavel: "Gabinete", prazoOriginal: "Dez/25" },
          { id: "cd2", ordem: 2, descricao: "Desenho de cenários de propostas de Plano de Carreira Docente para ser debatido", responsavel: "Gabinete", prazoOriginal: "Jun/26" },
          { id: "cd3", ordem: 3, descricao: "Estruturação de agenda de debate com órgãos da prefeitura e entidades sobre as propostas entre 2026 e 2028", responsavel: "Gabinete", prazoOriginal: "Ago/26" },
          { id: "cd4", ordem: 4, descricao: "Desenho da proposta do Plano de Carreira Docente", responsavel: "Gabinete", prazoOriginal: "Dez/28" },
        ]
      },
      {
        id: "formacao-profissional", nome: "Formação Profissional",
        meta2028: "100% dos anos da EF e grupos da EI com trilhas formativas reestruturadas, com ao menos 90% de participação dos professores",
        marcos: [
          { id: "fp1", ordem: 1, descricao: "Desenho e implementação de trilhas formativas reestruturadas para professores de 2º, 5º e 9º ano do Ens. Fundamental", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "fp2", ordem: 2, descricao: "Reestruturação das trilhas formativas para professores do 4º ano do Ens. Fundamental e G5 e G6 da Ed. Infantil", responsavel: "DEF e DEI", prazoOriginal: "Abr/26" },
          { id: "fp3", ordem: 3, descricao: "Reestruturação das trilhas formativas para professores do 1º e 3º ano do Ens. Fundamental e G3 e G4 da Ed. Infantil", responsavel: "DEF e DEI", prazoOriginal: "Abr/27" },
          { id: "fp4", ordem: 4, descricao: "Reestruturação das trilhas formativas para professores de G1 e G2 da Ed. Infantil", responsavel: "DEF e DEI", prazoOriginal: "Abr/28" },
        ]
      },
    ]
  },
  {
    id: "unidades-educativas",
    nome: "Unidades Educativas",
    cor: "#3AAD4E",
    corClaro: "#EDF8EF",
    diretrizes: [
      {
        id: "gestao-escolar", nome: "Gestão Escolar",
        meta2028: "Equipe gestora qualificada, com foco na aprendizagem e desenvolvimento e engajada nas trilhas formativas",
        marcos: [
          { id: "ge1", ordem: 1, descricao: "Desenho e implementação da trilha formativa para equipe gestora para 2025", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "ge2", ordem: 2, descricao: "Definição dos papéis e responsabilidades dos profissionais da equipe gestora", responsavel: "DEF e DEI", prazoOriginal: "Set/25" },
          { id: "ge3", ordem: 3, descricao: "Aperfeiçoamento no processo de seleção dos gestores para o próximo ciclo", responsavel: "Gabinete", prazoOriginal: "Out/25" },
          { id: "ge4", ordem: 4, descricao: "Desenho e implementação da trilha formativa para equipe gestora para 2026", responsavel: "DEF e DEI", prazoOriginal: "Abr/26" },
          { id: "ge5", ordem: 5, descricao: "Desenho e implementação da trilha formativa para equipe gestora para 2027", responsavel: "DEF e DEI", prazoOriginal: "Abr/27" },
          { id: "ge6", ordem: 6, descricao: "Desenho e implementação da trilha formativa para equipe gestora para 2028", responsavel: "DEF e DEI", prazoOriginal: "Abr/28" },
          { id: "ge7", ordem: 7, descricao: "Ajustes finos no processo de seleção da equipe gestora para o próximo ciclo", responsavel: "Gabinete", prazoOriginal: "Set/28" },
        ]
      },
      {
        id: "ensino-integral", nome: "Ensino Integral",
        meta2028: "Ofertar ao menos 50% das turmas dos Anos Iniciais (1º ao 5º ano) em tempo integral de turno único",
        marcos: [
          { id: "ei1", ordem: 1, descricao: "Projeção de nº de estudantes e turmas até 2028, considerando otimizações de enturmação", responsavel: "DIPED", prazoOriginal: "Ago/25" },
          { id: "ei2", ordem: 2, descricao: "Sistematização das disponibilidades e necessidades de infra nas unidades para viabilização do tempo integral", responsavel: "DIAOP", prazoOriginal: "Ago/25" },
          { id: "ei3", ordem: 3, descricao: "Cálculo de impacto financeiro da expansão considerando obras, alimentação e pessoal", responsavel: "Gabinete", prazoOriginal: "Set/25" },
          { id: "ei4", ordem: 4, descricao: "Estruturação do plano de expansão do ensino integral até 2028, ano a ano, considerando necessidades de infra e recursos", responsavel: "Gabinete", prazoOriginal: "2º sem/25" },
          { id: "ei5", ordem: 5, descricao: "Detalhamento e execução das ações necessárias para viabilizar a expansão planejada para 2026", responsavel: "DIAOP", prazoOriginal: "Ago/26" },
          { id: "ei6", ordem: 6, descricao: "Revisão do plano de expansão para 2027, refinando a necessidade de infraestrutura e impacto financeiro projetado", responsavel: "Gabinete", prazoOriginal: "Ago/27" },
        ]
      },
      {
        id: "infraestrutura", nome: "Infraestrutura",
        meta2028: "Unidades Educativas com infraestrutura adequada e suficiente para expansão do ensino integral",
        marcos: [
          { id: "inf1", ordem: 1, descricao: "Mapeamento das necessidades de manutenção predial das unidades educativas", responsavel: "DIAOP", prazoOriginal: "Set/25" },
          { id: "inf2", ordem: 2, descricao: "Execução do plano de obras visando expansão do integral em 2026", responsavel: "DIAOP", prazoOriginal: "Dez/25" },
          { id: "inf3", ordem: 3, descricao: "Execução do plano de obras após revisão da necessidade de infraestrutura para expansão do integral em 2027", responsavel: "DIAOP", prazoOriginal: "Dez/26" },
          { id: "inf4", ordem: 4, descricao: "Execução do plano de obras após revisão da necessidade de infraestrutura para expansão do integral em 2028", responsavel: "DIAOP", prazoOriginal: "Dez/27" },
        ]
      },
      {
        id: "ambiente-acolhedor", nome: "Ambiente Acolhedor e Família Presente",
        meta2028: "Unidades Educativas com implementação de iniciativas que promovam ambiente acolhedor e família presente",
        marcos: [
          { id: "aa1", ordem: 1, descricao: "Desenho de iniciativas para fortalecer e expandir o Grêmio Estudantil, junto da coordenadora e professores articuladores", responsavel: "DEF", prazoOriginal: "Dez/25" },
          { id: "aa2", ordem: 2, descricao: "Desenho do calendário letivo de 2026 para expandir número de dias de presença das famílias (base para demais anos)", responsavel: "DEF e DEI", prazoOriginal: "Dez/25" },
          { id: "aa3", ordem: 3, descricao: "Implementação de programa de formação continuada sobre o Protocolo 'Escuta Especializada' nas UEs", responsavel: "DEF e DEI", prazoOriginal: "Mar/26" },
        ]
      },
    ]
  },
  {
    id: "secretaria",
    nome: "Secretaria",
    cor: "#F07820",
    corClaro: "#FEF3EA",
    diretrizes: [
      {
        id: "apoio-escolas", nome: "Apoio às Escolas",
        meta2028: "100% das Unidades Educativas com acompanhamento realizado por tutores ou assessores pedagógicos",
        marcos: [
          { id: "ae1", ordem: 1, descricao: "Estruturação e implementação da Tutoria Pedagógica com foco no 2º, 5º e 9º ano do Ensino Fundamental", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "ae2", ordem: 2, descricao: "Implementação da Tutoria Administrativa para apoiar as UEs com assuntos administrativos", responsavel: "Gabinete", prazoOriginal: "Ago/25" },
          { id: "ae3", ordem: 3, descricao: "Consolidação da nova política de Assessoramento Pedagógico para a Educação Infantil", responsavel: "DEI", prazoOriginal: "Abr/26" },
          { id: "ae4", ordem: 4, descricao: "Expansão da Tutoria Pedagógica para 1º e 4º ano do Ensino Fundamental", responsavel: "DEF", prazoOriginal: "Abr/26" },
          { id: "ae5", ordem: 5, descricao: "Expansão da Tutoria Pedagógica para 3º ano do Ensino Fundamental", responsavel: "DEF", prazoOriginal: "Abr/27" },
          { id: "ae6", ordem: 6, descricao: "Revisão e aperfeiçoamento do plano de apoio às Unidades Educativas em 2027", responsavel: "DEF e DEI", prazoOriginal: "Fev/27" },
          { id: "ae7", ordem: 7, descricao: "Revisão e aperfeiçoamento do plano de apoio às Unidades Educativas em 2028", responsavel: "DEF e DEI", prazoOriginal: "Fev/28" },
        ]
      },
      {
        id: "governanca", nome: "Governança e Implementação",
        meta2028: "100% das diretrizes do Floripa Mais Aprendizagem sendo acompanhadas pela Secretaria",
        marcos: [
          { id: "gov1", ordem: 1, descricao: "Implementação de reuniões de governança dos marcos de entrega e resultados do Floripa Mais Aprendizagem", responsavel: "Gabinete", prazoOriginal: "OK" },
          { id: "gov2", ordem: 2, descricao: "Estruturação de plataforma (a ser definida) para acompanhamento de marcos de entrega e indicadores do Floripa Mais Aprendizagem", responsavel: "Gabinete", prazoOriginal: "Mai/25" },
          { id: "gov3", ordem: 3, descricao: "Inclusão dos Planos de Ação das Unidades Educativas em plataforma (a ser definida) para acompanhamento dos avanços", responsavel: "DEF", prazoOriginal: "Jul/25" },
          { id: "gov4", ordem: 4, descricao: "Revisão dos marcos de entrega e seus prazos para execução em 2026", responsavel: "Gabinete", prazoOriginal: "Dez/25" },
          { id: "gov5", ordem: 5, descricao: "Revisão dos marcos de entrega e seus prazos para execução em 2027", responsavel: "Gabinete", prazoOriginal: "Dez/26" },
          { id: "gov6", ordem: 6, descricao: "Revisão dos marcos de entrega e seus prazos para execução em 2028", responsavel: "Gabinete", prazoOriginal: "Dez/27" },
        ]
      },
      {
        id: "visao-rede", nome: "Visão de Rede",
        meta2028: "Ao menos 80% de participação dos diretores nos encontros bimestrais de trocas de experiência",
        marcos: [
          { id: "vr1", ordem: 1, descricao: "Definição das diretrizes dos projetos a serem executados pelas Unidades Educativas em 2025", responsavel: "DEF", prazoOriginal: "OK" },
          { id: "vr2", ordem: 2, descricao: "Implementação de agendas bimestrais de encontros entre gestores escolares para trocas de boas práticas", responsavel: "Gabinete", prazoOriginal: "Ago/25" },
          { id: "vr3", ordem: 3, descricao: "Definição das diretrizes dos projetos a serem executados pelas Unidades Educativas em 2026", responsavel: "DEF e DEI", prazoOriginal: "Jan/26" },
          { id: "vr4", ordem: 4, descricao: "Definição das diretrizes dos projetos a serem executados pelas Unidades Educativas em 2027", responsavel: "DEF e DEI", prazoOriginal: "Jan/27" },
          { id: "vr5", ordem: 5, descricao: "Definição das diretrizes dos projetos a serem executados pelas Unidades Educativas em 2028", responsavel: "DEF e DEI", prazoOriginal: "Jan/28" },
        ]
      },
      {
        id: "equipe-qualificada", nome: "Equipe Qualificada",
        meta2028: "Ao menos 90% de frequência nas formações continuadas oferecidas às equipes da Secretaria",
        marcos: [
          { id: "eq1", ordem: 1, descricao: "Mapeamento das habilidades e necessidades formativas das equipes da Secretaria", responsavel: "Gabinete", prazoOriginal: "Dez/25" },
          { id: "eq2", ordem: 2, descricao: "Definição e implementação do calendário de formação para as equipes da Secretaria em 2026", responsavel: "Gabinete", prazoOriginal: "Abr/26" },
          { id: "eq3", ordem: 3, descricao: "Definição e implementação do calendário de formação para as equipes da Secretaria em 2027", responsavel: "Gabinete", prazoOriginal: "Abr/27" },
          { id: "eq4", ordem: 4, descricao: "Definição e implementação do calendário de formação para as equipes da Secretaria em 2028", responsavel: "Gabinete", prazoOriginal: "Abr/28" },
        ]
      },
      {
        id: "eficiencia-gestao", nome: "Eficiência de Gestão",
        meta2028: "100% das Diretorias da Secretaria com processos bem definidos e utilizando ferramentas que otimizem o trabalho",
        marcos: [
          { id: "eg1", ordem: 1, descricao: "Aprofundamento do diagnóstico dos processos e ferramentas utilizadas pelas equipes da Secretaria", responsavel: "Gabinete", prazoOriginal: "Set/25" },
          { id: "eg2", ordem: 2, descricao: "Desenho e implementação de processos otimizados do trabalho das equipes da Secretaria", responsavel: "Gabinete", prazoOriginal: "Dez/25" },
          { id: "eg3", ordem: 3, descricao: "Desenvolvimento e implementação de ferramentas adicionais para ganho de eficiência das equipes", responsavel: "Gabinete", prazoOriginal: "Jun/26" },
        ]
      },
      {
        id: "colaboracao-entes", nome: "Colaboração entre Entes Federados",
        meta2028: "Municipalização completa dos Anos Iniciais e Estadualização completa dos Anos Finais",
        marcos: [
          { id: "cef1", ordem: 1, descricao: "Estudo de cenários para realizar os movimentos de municipalização do AI e estadualização do AF", responsavel: "Gabinete", prazoOriginal: "Ago/25" },
          { id: "cef2", ordem: 2, descricao: "Alinhamento com SED-SC, MPSC e TCE-SC para viabilização da colaboração a partir de 2026", responsavel: "Gabinete", prazoOriginal: "Set/25" },
          { id: "cef3", ordem: 3, descricao: "Estadualização do 6º ano na Rede Municipal e municipalização dos estudantes de 1º ano da Rede Estadual em 2026", responsavel: "DEF", prazoOriginal: "Out/25" },
          { id: "cef4", ordem: 4, descricao: "Estadualização do 7º ano na Rede Municipal e municipalização dos estudantes de 2º ano da Rede Estadual em 2027", responsavel: "DEF", prazoOriginal: "Out/26" },
          { id: "cef5", ordem: 5, descricao: "Estadualização do 8º ano na Rede Municipal e municipalização dos estudantes de 3º ano da Rede Estadual em 2028", responsavel: "DEF", prazoOriginal: "Out/27" },
          { id: "cef6", ordem: 6, descricao: "Estadualização completa dos Anos Finais e municipalização dos estudantes de 4º ano da Rede Estadual em 2029", responsavel: "DEF", prazoOriginal: "Out/28" },
          { id: "cef7", ordem: 7, descricao: "Municipalização completa dos Anos Iniciais da Rede Estadual em 2030", responsavel: "DEF", prazoOriginal: "Out/29" },
        ]
      },
    ]
  },
  {
    id: "tecnologia",
    nome: "Tecnologia",
    cor: "#7B5EA7",
    corClaro: "#F3EFF9",
    diretrizes: [
      {
        id: "tecnologia", nome: "Tecnologia",
        meta2028: "100% das Unidades Educativas com recursos digitais aplicados em práticas pedagógicas",
        marcos: [
          { id: "tec1", ordem: 1, descricao: "Diagnóstico do uso de tecnologia educacional na Rede e dos sistemas de gestão pelas equipes da Secretaria", responsavel: "Gabinete", prazoOriginal: "Ago/25" },
          { id: "tec2", ordem: 2, descricao: "Desenvolvimento de painel de gestão escolar para as unidades educativas", responsavel: "DIPED", prazoOriginal: "Out/25" },
          { id: "tec3", ordem: 3, descricao: "Plano de adequação da infraestrutura tecnológica nas unidades educativas", responsavel: "Gabinete", prazoOriginal: "Dez/25" },
          { id: "tec4", ordem: 4, descricao: "Desenvolvimento de currículo pensado para uso de recursos digitais em práticas pedagógicas", responsavel: "DEF e DEI", prazoOriginal: "Mar/26" },
          { id: "tec5", ordem: 5, descricao: "Plano de formação para os professores implementarem a BNCC Computação", responsavel: "DEF e DEI", prazoOriginal: "Mar/26" },
        ]
      },
    ]
  },
];

const STATUS_OPTIONS = [
  { value: "nao-iniciado", label: "Não Iniciado", cor: "#6B7280", bg: "#F3F4F6" },
  { value: "em-andamento", label: "Em Andamento", cor: "#3B82F6", bg: "#DBEAFE" },
  { value: "concluido", label: "Concluído", cor: "#16A34A", bg: "#DCFCE7" },
  { value: "despriorizado", label: "Despriorizado", cor: "#B45309", bg: "#FEF3C7" },
  { value: "inviabilizado", label: "Inviabilizado", cor: "#DC2626", bg: "#FEE2E2" },
];

function getStatusConfig(value) {
  return STATUS_OPTIONS.find(s => s.value === value) || STATUS_OPTIONS[0];
}

// ── Supabase data functions ──
async function loadMarcosFromDB() {
  const { data } = await supabase.from("marcos_state").select("*");
  const state = {};
  (data || []).forEach(row => {
    state[row.id] = { status: row.status, prazo: row.prazo, areas: row.areas, obs: row.obs };
  });
  return state;
}

async function saveMarcoDB(id, values) {
  const payload = { id, status: values.status || "nao-iniciado", prazo: values.prazo || null, areas: values.areas || null, obs: values.obs || null };
  await supabase.from("marcos_state").upsert(payload);
}

async function loadIndicadoresFromDB() {
  const { data } = await supabase.from("indicadores_state").select("*");
  const state = {};
  (data || []).forEach(row => {
    state[row.id] = { resultado: row.resultado, notas: row.notas };
  });
  return state;
}

async function saveIndicadorDB(id, values) {
  const payload = { id, resultado: values.resultado !== undefined ? values.resultado : null, notas: values.notas || null };
  await supabase.from("indicadores_state").upsert(payload);
}

async function loadCustomMarcosFromDB() {
  const { data } = await supabase.from("marcos_custom").select("*");
  return data || [];
}

async function saveCustomMarcoDB(marco) {
  await supabase.from("marcos_custom").upsert(marco);
}

// ── Multi-select dropdown ──────────────────────────────────────────────────────
function MultiSelect({ label, options, selected, onChange, colorMap }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggle(v) {
    if (selected.includes(v)) onChange(selected.filter(x => x !== v));
    else onChange([...selected, v]);
  }

  const displayLabel = selected.length === 0 ? label : selected.length === 1 ? selected[0] : `${selected.length} selecionados`;

  return (
    <div ref={ref} style={{ position: "relative", flex: "1 1 140px" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "7px 10px", border: selected.length > 0 ? "1.5px solid #3B82F6" : "1px solid #e5e7eb",
          borderRadius: 7, fontSize: 13, background: selected.length > 0 ? "#EFF6FF" : "white",
          color: selected.length > 0 ? "#1D4ED8" : "#555", cursor: "pointer", textAlign: "left",
          display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: selected.length > 0 ? 600 : 400,
          outline: "none", whiteSpace: "nowrap",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{displayLabel}</span>
        <span style={{ marginLeft: 4, fontSize: 10, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 200,
          background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", minWidth: "100%", padding: "6px 0",
        }}>
          {selected.length > 0 && (
            <button onClick={() => onChange([])} style={{ width: "100%", padding: "5px 12px", border: "none", background: "none", cursor: "pointer", fontSize: 11, color: "#EF4444", textAlign: "left", fontWeight: 600 }}>
              Limpar seleção
            </button>
          )}
          {options.map(opt => {
            const isSelected = selected.includes(opt.value || opt);
            const val = opt.value || opt;
            const lbl = opt.label || opt;
            const col = colorMap ? colorMap[val] : null;
            return (
              <label key={val} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", cursor: "pointer", background: isSelected ? "#F0F7FF" : "transparent" }}>
                <input type="checkbox" checked={isSelected} onChange={() => toggle(val)} style={{ cursor: "pointer", accentColor: "#3B82F6", width: 14, height: 14 }} />
                {col && <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, flexShrink: 0 }} />}
                <span style={{ fontSize: 13, color: "#222" }}>{lbl}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Area multi-select inline (for each marco row) ─────────────────────────────
function AreaSelector({ value, onChange, cor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const areas = Array.isArray(value) ? value : (value ? [value] : []);

  function toggle(a) {
    if (areas.includes(a)) onChange(areas.filter(x => x !== a));
    else onChange([...areas, a]);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center", maxWidth: 120,
      }}>
        {areas.length === 0
          ? <span style={{ fontSize: 11, color: "#ccc", fontStyle: "italic" }}>Definir</span>
          : areas.map(a => (
            <span key={a} style={{ fontSize: 10, background: "#f0f4ff", color: cor, border: `1px solid ${cor}44`, padding: "1px 5px", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" }}>{a}</span>
          ))
        }
        <span style={{ fontSize: 9, color: "#aaa", flexShrink: 0 }}>✎</span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 2px)", left: 0, zIndex: 300,
          background: "white", border: "1px solid #e5e7eb", borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)", padding: "6px 0", minWidth: 130,
        }}>
          <div style={{ padding: "4px 10px 4px", fontSize: 10, color: "#aaa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Áreas responsáveis</div>
          {AREAS_FIXAS.map(a => {
            const checked = areas.includes(a);
            return (
              <label key={a} style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 10px", cursor: "pointer", background: checked ? "#F0F7FF" : "transparent" }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(a)} style={{ cursor: "pointer", accentColor: cor, width: 13, height: 13 }} />
                <span style={{ fontSize: 12, color: "#222" }}>{a}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Delete Confirm Modal ────────────────────────────────────────────────────────
function DeleteConfirmModal({ onConfirm, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(12,35,64,0.45)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
      <div style={{ background: "white", borderRadius: 14, padding: "32px 28px", width: 420, maxWidth: "90vw", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🗑️</div>
        <h2 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 800, color: "#0C2340" }}>Excluir Marco</h2>
        <p style={{ margin: "0 0 24px", fontSize: 14, color: "#666", lineHeight: 1.55 }}>
          Tem certeza que deseja excluir este marco?<br />
          <strong style={{ color: "#DC2626" }}>Esta ação não pode ser desfeita.</strong>
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 24px", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#555", transition: "all 0.2s" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{ padding: "10px 24px", border: "none", borderRadius: 8, background: "#DC2626", color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(220,38,38,0.25)", transition: "all 0.2s" }}
          >
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}

function AddMarcoModal({ eixos, onAdd, onClose, editingMarco }) {
  const initialEixoId = useMemo(() => {
    if (!editingMarco) return eixos[0].id;
    for (const e of eixos) {
      for (const d of e.diretrizes) {
        if (d.marcos.some(m => m.id === editingMarco.id)) {
          return e.id;
        }
      }
    }
    return eixos[0].id;
  }, [editingMarco, eixos]);

  const initialDiretrizId = useMemo(() => {
    if (!editingMarco) return eixos[0].diretrizes[0].id;
    for (const e of eixos) {
      for (const d of e.diretrizes) {
        if (d.marcos.some(m => m.id === editingMarco.id)) {
          return d.id;
        }
      }
    }
    return eixos[0].diretrizes[0].id;
  }, [editingMarco, eixos]);

  const [eixoId, setEixoId] = useState(initialEixoId);
  const [diretrizId, setDiretrizId] = useState(initialDiretrizId);
  const [descricao, setDescricao] = useState(editingMarco ? editingMarco.descricao : "");
  const [areas, setAreas] = useState(() => {
    if (!editingMarco) return [];
    if (Array.isArray(editingMarco.responsavel)) return editingMarco.responsavel;
    return [];
  });
  const [prazo, setPrazo] = useState(editingMarco ? editingMarco.prazoOriginal : "");

  const eixoSel = eixos.find(e => e.id === eixoId);
  const diretrizes = eixoSel ? eixoSel.diretrizes : [];

  function handleEixoChange(v) {
    setEixoId(v);
    const e = eixos.find(x => x.id === v);
    setDiretrizId(e ? e.diretrizes[0].id : "");
  }

  function handleSubmit() {
    if (!descricao.trim() || !prazo.trim()) return;
    onAdd({ eixoId, diretrizId, descricao: descricao.trim(), responsavel: areas, prazo: prazo.trim() });
    onClose();
  }

  const labelStyle = { display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" };
  const inputStyle = { width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 12, padding: 28, width: 520, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
            {editingMarco ? "Editar Marco de Entrega" : "Novo Marco de Entrega"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#888", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Eixo</label>
            <select value={eixoId} onChange={e => handleEixoChange(e.target.value)} style={{ ...inputStyle, background: "white", cursor: "pointer" }}>
              {eixos.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Diretriz</label>
            <select value={diretrizId} onChange={e => setDiretrizId(e.target.value)} style={{ ...inputStyle, background: "white", cursor: "pointer" }}>
              {diretrizes.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Descrição do Marco</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva o marco de entrega..."
              style={{ ...inputStyle, height: 80, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Áreas Responsáveis</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AREAS_FIXAS.map(a => {
                const checked = areas.includes(a);
                return (
                  <label key={a} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", border: `1.5px solid ${checked ? "#1F3D7A" : "#e5e7eb"}`, borderRadius: 6, cursor: "pointer", background: checked ? "#EEF2FA" : "white", fontSize: 13, fontWeight: checked ? 700 : 400, color: checked ? "#1F3D7A" : "#555" }}>
                    <input type="checkbox" checked={checked} onChange={() => { if (checked) setAreas(areas.filter(x => x !== a)); else setAreas([...areas, a]); }} style={{ accentColor: "#1F3D7A" }} />
                    {a}
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <label style={labelStyle}>Prazo</label>
            <input value={prazo} onChange={e => setPrazo(e.target.value)} placeholder="ex: Jun/26" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: 7, background: "white", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
          <button onClick={handleSubmit} disabled={!descricao.trim() || !prazo.trim()}
            style={{ padding: "8px 20px", border: "none", borderRadius: 7, background: descricao.trim() && prazo.trim() ? "#1F3D7A" : "#ccc", color: "white", cursor: descricao.trim() && prazo.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 600 }}>
            {editingMarco ? "Salvar Alterações" : "Adicionar Marco"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Marco Row ─────────────────────────────────────────────────────────────────
function MarcoRow({ marco, marcoState, onUpdate, eixoCor, isNew, isAdmin, onEdit, onDelete }) {
  const status = marcoState.status || "nao-iniciado";
  // Areas: stored in marcoState.areas; fallback to marco.responsavel parsed into individual areas
  function parseAreas(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw.split(/\s+e\s+|\s*\+\s*|\s*,\s*/).map(s => s.trim()).filter(Boolean);
  }
  const areas = marcoState.areas != null ? marcoState.areas : parseAreas(marco.responsavel);

  const [editingPrazo, setEditingPrazo] = useState(false);
  const prazoAjustado = marcoState.prazo !== undefined ? marcoState.prazo : "";
  const [prazoInput, setPrazoInput] = useState(prazoAjustado);

  const statusCfg = getStatusConfig(status);

  function handleStatusChange(e) { onUpdate(marco.id, { ...marcoState, status: e.target.value }); }
  function handlePrazoSave() { onUpdate(marco.id, { ...marcoState, prazo: prazoInput }); setEditingPrazo(false); }
  function handleAreasChange(newAreas) { onUpdate(marco.id, { ...marcoState, areas: newAreas }); }

  const isOK = marco.prazoOriginal === "OK";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "26px 1fr 110px 80px 88px 140px 130px",
      gap: 0,
      borderBottom: "1px solid #f0f0f0",
      background: status === "concluido" ? "#f8fef9" : status === "inviabilizado" ? "#fff8f8" : status === "despriorizado" ? "#fffdf5" : isNew ? "#fffef0" : "white",
      opacity: status === "inviabilizado" || status === "despriorizado" ? 0.72 : 1,
    }}>
      {/* Nº */}
      <div style={{ padding: "11px 0 10px 12px", display: "flex", alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: eixoCor }}>{marco.ordem}</span>
      </div>
      {/* Descrição */}
      <div style={{ padding: "9px 10px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          <span style={{ fontSize: 12.5, color: "#1a1a1a", lineHeight: 1.45 }}>{marco.descricao}</span>
        </div>
        <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {marco.id.startsWith("custom_")
            ? <span style={{ fontSize: 9, background: "#DBEAFE", color: "#2563EB", padding: "1px 6px", borderRadius: 99, fontWeight: 700 }}>Adicionado</span>
            : <span style={{ fontSize: 9, background: "#F3F4F6", color: "#6B7280", padding: "1px 6px", borderRadius: 99, fontWeight: 600 }}>Planejado</span>
          }
          {marco.id.startsWith("custom_") && isAdmin && (
            <>
              <button
                onClick={() => onEdit && onEdit(marco)}
                title="Editar marco"
                style={{ fontSize: 9, padding: "1px 7px", borderRadius: 99, border: "1px solid #93C5FD", background: "#EFF6FF", color: "#2563EB", cursor: "pointer", fontWeight: 700, lineHeight: 1.6 }}
              >✎ Editar</button>
              <button
                onClick={() => onDelete && onDelete(marco)}
                title="Excluir marco"
                style={{ fontSize: 9, padding: "1px 7px", borderRadius: 99, border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontWeight: 700, lineHeight: 1.6 }}
              >✕ Excluir</button>
            </>
          )}
        </div>
      </div>
      {/* Área responsável */}
      <div style={{ padding: "9px 8px", display: "flex", alignItems: "flex-start", paddingTop: 11 }}>
        {isAdmin ? (
          <AreaSelector value={areas} onChange={handleAreasChange} cor={eixoCor} />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {areas.map(a => <span key={a} style={{ fontSize: 10, background: "#f0f4ff", color: eixoCor, border: `1px solid ${eixoCor}44`, padding: "1px 5px", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" }}>{a}</span>)}
          </div>
        )}
      </div>
      {/* Prazo Original — fixo */}
      <div style={{ padding: "9px 6px", display: "flex", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: isOK ? "#16a34a" : "#555", fontWeight: isOK ? 700 : 400 }}>
          {isOK ? "✓ OK" : marco.prazoOriginal}
        </span>
      </div>
      {/* Prazo Ajustado — editável */}
      <div style={{ padding: "9px 6px", display: "flex", alignItems: "center" }}>
        {editingPrazo ? (
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <input value={prazoInput} onChange={e => setPrazoInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handlePrazoSave(); if (e.key === "Escape") setEditingPrazo(false); }}
              style={{ width: 60, fontSize: 11, padding: "3px 5px", border: "1px solid #ccc", borderRadius: 4, outline: "none" }} autoFocus />
            <button onClick={handlePrazoSave} style={{ fontSize: 10, padding: "3px 5px", background: eixoCor, color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>OK</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 12, color: prazoAjustado ? "#2563eb" : "#bbb", fontWeight: prazoAjustado ? 600 : 400, fontStyle: prazoAjustado ? "normal" : "italic" }}>
              {prazoAjustado || "—"}
            </span>
            {isAdmin && <button onClick={() => { setPrazoInput(prazoAjustado); setEditingPrazo(true); }} title="Editar prazo ajustado"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", padding: 2, fontSize: 11, lineHeight: 1 }}>✎</button>}
          </div>
        )}
      </div>
      {/* Status */}
      <div style={{ padding: "8px 6px 8px 0", display: "flex", alignItems: "center" }}>
        <select value={status} onChange={handleStatusChange} disabled={!isAdmin}
          style={{ fontSize: 11, padding: "4px 5px", border: `1.5px solid ${statusCfg.cor}55`, borderRadius: 6, background: statusCfg.bg, color: statusCfg.cor, fontWeight: 700, cursor: "pointer", outline: "none", width: "100%" }}>
          {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {/* Observações */}
      <div style={{ padding: "8px 10px 8px 0", display: "flex", alignItems: "center" }}>
        <input
          value={marcoState.obs || ""}
          onChange={e => onUpdate(marco.id, { ...marcoState, obs: e.target.value })}
          disabled={!isAdmin}
          placeholder={isAdmin ? "Observações..." : marcoState.obs ? "" : "—"}
          style={{ width: "100%", fontSize: 11, padding: "5px 7px", border: "1px solid #e5e7eb", borderRadius: 5, outline: "none", color: "#444", boxSizing: "border-box" }}
        />
      </div>
    </div>
  );
}

// ── Diretriz Card ─────────────────────────────────────────────────────────────
function DiretrizCard({ diretriz, state, onUpdate, eixoCor, eixoCorClaro, newIds, isAdmin, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(true);

  const counts = useMemo(() => {
    const c = {}; STATUS_OPTIONS.forEach(s => { c[s.value] = 0; });
    diretriz.marcos.forEach(m => { const st = (state[m.id] || {}).status || "nao-iniciado"; c[st]++; });
    return c;
  }, [diretriz.marcos, state]);

  const total = diretriz.marcos.length;
  const excluidos = counts["inviabilizado"] + counts["despriorizado"];
  const denominador = total - excluidos;
  const pct = denominador > 0 ? Math.round((counts["concluido"] / denominador) * 100) : 0;

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 9, overflow: "hidden", marginBottom: 10 }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: eixoCorClaro, cursor: "pointer", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: eixoCor }}>{diretriz.nome}</span>
              <span style={{ fontSize: 11, color: "#777" }}>{total} marcos</span>
            </div>
            {diretriz.meta2028 && (
              <div style={{ fontSize: 11, color: "#777", marginTop: 2, fontStyle: "italic", lineHeight: 1.3 }}>
                Meta 2028: {diretriz.meta2028}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {STATUS_OPTIONS.map(s => counts[s.value] > 0 && (
              <span key={s.value} style={{ fontSize: 10, padding: "1px 6px", borderRadius: 99, background: s.bg, color: s.cor, border: `1px solid ${s.cor}33`, fontWeight: 700 }}>{counts[s.value]}</span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 52, height: 5, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: eixoCor, borderRadius: 3, transition: "width 0.3s" }} />
            </div>
            <span style={{ fontSize: 10, color: "#666", fontWeight: 700 }}>{pct}%</span>
          </div>
          <span style={{ fontSize: 13, color: eixoCor, transform: expanded ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "26px 1fr 110px 80px 88px 140px 130px", background: "#fafafa", borderBottom: "1px solid #e5e7eb" }}>
            <div />
            <div style={{ padding: "5px 10px", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Marco de Entrega</div>
            <div style={{ padding: "5px 8px", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Responsável</div>
            <div style={{ padding: "5px 6px", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Prazo Orig.</div>
            <div style={{ padding: "5px 6px", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Prazo Ajust.</div>
            <div style={{ padding: "5px 6px 5px 0", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
            <div style={{ padding: "5px 10px 5px 0", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.05em" }}>Observações</div>
          </div>
          {diretriz.marcos.map(marco => (
            <MarcoRow key={marco.id} marco={marco} marcoState={state[marco.id] || {}} onUpdate={onUpdate} eixoCor={eixoCor} isNew={newIds && newIds.has(marco.id)} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Eixo Section ──────────────────────────────────────────────────────────────
function EixoSection({ eixo, state, onUpdate, newIds, isAdmin, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const totalMarcos = eixo.diretrizes.reduce((a, d) => a + d.marcos.length, 0);
  const concluidos = eixo.diretrizes.reduce((a, d) => a + d.marcos.filter(m => (state[m.id] || {}).status === "concluido").length, 0);
  const eixoExcluidos = eixo.diretrizes.reduce((a, d) => a + d.marcos.filter(m => { const s = (state[m.id] || {}).status || "nao-iniciado"; return s === "inviabilizado" || s === "despriorizado"; }).length, 0);
  const eixoDenom = totalMarcos - eixoExcluidos;

  return (
    <div style={{ marginBottom: 24 }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", background: eixo.cor, borderRadius: expanded ? "9px 9px 0 0" : 9, cursor: "pointer", userSelect: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "white" }}>{eixo.nome}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{eixo.diretrizes.length} diretrizes · {totalMarcos} marcos</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{concluidos}/{eixoDenom} concluídos</span>
          <span style={{ fontSize: 15, color: "white", transform: expanded ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
        </div>
      </div>
      {expanded && (
        <div style={{ border: `1px solid ${eixo.cor}44`, borderTop: "none", borderRadius: "0 0 9px 9px", padding: "14px 14px 6px" }}>
          {eixo.diretrizes.map(d => (
            <DiretrizCard key={d.id} diretriz={d} state={state} onUpdate={onUpdate} eixoCor={eixo.cor} eixoCorClaro={eixo.corClaro} newIds={newIds} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Summary Bar ───────────────────────────────────────────────────────────────
function SummaryBar({ state, eixos }) {
  const allMarcos = eixos.flatMap(e => e.diretrizes.flatMap(d => d.marcos));
  const total = allMarcos.length;
  const counts = {};
  STATUS_OPTIONS.forEach(s => { counts[s.value] = 0; });
  allMarcos.forEach(m => { const st = (state[m.id] || {}).status || "nao-iniciado"; counts[st]++; });

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
      {STATUS_OPTIONS.map(s => (
        <div key={s.value} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, background: s.bg, border: `1px solid ${s.cor}33`, flex: "1 1 auto", minWidth: 120 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.cor }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.cor, lineHeight: 1 }}>{counts[s.value]}</div>
            <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>{s.label}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, color: s.cor, fontWeight: 700 }}>{Math.round((counts[s.value] / total) * 100)}%</div>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const MESES = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
function parsePrazo(p) {
  if (!p || p === "OK") return null;
  const m = p.toLowerCase().match(/^([a-zç]+)\/(\d{2})$/);
  if (!m) return null;
  const mes = MESES[m[1].substring(0, 3)];
  if (!mes) return null;
  return { mes, ano: 2000 + parseInt(m[2]) };
}

const EIXO_COLOR_MAP = Object.fromEntries(EIXOS.map(e => [e.id, e.cor]));
const ANOS = ["2025", "2026", "2027", "2028", "2029", "2030"];
const MESES_NOMES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

// ── Main App ──────────────────────────────────────────────────────────────────

// ══════════════════════════════════════════════════════════════════════════════
// INDICADORES DATA
// ══════════════════════════════════════════════════════════════════════════════

const METAS_CHAVE = [
  { id: "mc1", num: 1, titulo: "Parâmetros Nacionais de Qualidade", descricao: "Implementar e monitorar Parâmetros Nacionais de Qualidade em todas as UEs", etapa: "Educação Infantil", cor: "#1F3D7A", tipo: "percent", objetivo: 100, unidade: "%" },
  { id: "mc2", num: 2, titulo: "Alfabetização na Idade Certa", descricao: "Alcançar 90% de crianças alfabetizadas na idade certa", etapa: "Anos Iniciais", cor: "#1F3D7A", tipo: "percent", objetivo: 90, unidade: "%" },
  { id: "mc3", num: 3, titulo: "IDEB dos Anos Iniciais", descricao: "Ser top 3 entre as capitais no IDEB dos Anos Iniciais", etapa: "Anos Iniciais", cor: "#1F3D7A", tipo: "ranking", objetivo: 3, limite: 26, unidade: "ª posição" },
  { id: "mc4", num: 4, titulo: "IDEB dos Anos Finais", descricao: "Ser top 3 entre as capitais no IDEB dos Anos Finais", etapa: "Anos Finais", cor: "#1F3D7A", tipo: "ranking", objetivo: 3, limite: 26, unidade: "ª posição" },
  { id: "mc5", num: 5, titulo: "Redução de Insuficiência", descricao: "Reduzir em 50% o número de estudantes no nível 'insuficiente' ao final de cada etapa", etapa: "Todas as Etapas", cor: "#1F3D7A", tipo: "percent", objetivo: 50, unidade: "%" },
];

// MC_STATUS removed - metas-chave now use auto-classification

const INDICADORES_DIRETRIZ = [
  {
    eixoId: "aprendizagem", diretrizNome: "Frequência e Permanência", indicadores: [
      { id: "ind_freq1", nome: "% Frequência nas UEs", metas: { 2025: 90, 2026: 92, 2027: 95, 2028: 95 } },
    ]
  },
  {
    eixoId: "aprendizagem", diretrizNome: "Inclusão e Equidade", indicadores: [
      { id: "ind_inc1", nome: "% crianças e estudantes com prof. de apoio atendidas", metas: { 2025: 100, 2026: 100, 2027: 100, 2028: 100 } },
      { id: "ind_inc2", nome: "Redução da diferença de aprendizagem entre grupos de equidade", metas: { 2025: null, 2026: null, 2027: 25, 2028: 50 } },
    ]
  },
  {
    eixoId: "aprendizagem", diretrizNome: "Gestão Pedagógica", indicadores: [
      { id: "ind_gp1", nome: "% UEs com Plano de Ação e metas definidas e acompanhadas", metas: { 2025: 30, 2026: 100, 2027: 100, 2028: 100 } },
    ]
  },
  {
    eixoId: "aprendizagem", diretrizNome: "Currículo", indicadores: [
      { id: "ind_cur1", nome: "% UEs utilizando currículo revisado do EF", metas: { 2025: null, 2026: null, 2027: 90, 2028: 100 } },
    ]
  },
  {
    eixoId: "aprendizagem", diretrizNome: "Material Pedagógico", indicadores: [
      { id: "ind_mp1", nome: "% turmas de EF utilizando material pedagógico alinhado à BNCC", metas: { 2025: 45, 2026: 60, 2027: 100, 2028: 100 } },
    ]
  },
  {
    eixoId: "aprendizagem", diretrizNome: "Avaliação", indicadores: [
      { id: "ind_av1", nome: "% participação dos estudantes no Avalia Floripa", metas: { 2025: 85, 2026: 85, 2027: 85, 2028: 85 } },
      { id: "ind_av2", nome: "% UEs de Ed. Infantil participando da avaliação de qualidade", metas: { 2025: null, 2026: 30, 2027: 60, 2028: 100 } },
    ]
  },
  {
    eixoId: "aprendizagem", diretrizNome: "Superação de Defasagens", indicadores: [
      { id: "ind_sd1", nome: "% redução de estudantes AI e AF com aprendizagem insuficiente", metas: { 2025: 30, 2026: 30, 2027: 30, 2028: 30 } },
    ]
  },
  {
    eixoId: "professores", diretrizNome: "Gestão do Trabalho Docente", indicadores: [
      { id: "ind_gtd1", nome: "% UEs com nº de profissionais aderente aos normativos", metas: { 2025: null, 2026: 100, 2027: 100, 2028: 100 } },
    ]
  },
  {
    eixoId: "professores", diretrizNome: "Formação Profissional", indicadores: [
      { id: "ind_fp1", nome: "% participação nas trilhas formativas", metas: { 2025: 90, 2026: 90, 2027: 90, 2028: 90 } },
      { id: "ind_fp2", nome: "% anos/grupos com trilhas formativas desenhadas", metas: { 2025: 30, 2026: 60, 2027: 80, 2028: 100 } },
    ]
  },
  {
    eixoId: "unidades-educativas", diretrizNome: "Gestão Escolar", indicadores: [
      { id: "ind_ge1", nome: "% participação nas trilhas formativas para gestores", metas: { 2025: 90, 2026: 90, 2027: 90, 2028: 90 } },
    ]
  },
  {
    eixoId: "unidades-educativas", diretrizNome: "Ensino Integral", indicadores: [
      { id: "ind_ei1", nome: "% turmas dos Anos Iniciais em tempo integral", metas: { 2025: 25, 2026: 35, 2027: 45, 2028: 50 } },
    ]
  },
  {
    eixoId: "unidades-educativas", diretrizNome: "Infraestrutura", indicadores: [
      { id: "ind_inf1", nome: "% execução das obras previstas para o ano", metas: { 2025: 80, 2026: 80, 2027: 80, 2028: 80 } },
    ]
  },
  {
    eixoId: "unidades-educativas", diretrizNome: "Ambiente Acolhedor e Família Presente", indicadores: [
      { id: "ind_aa1", nome: "% UEs com Grêmio Estudantil ativo", metas: { 2025: 60, 2026: 70, 2027: 75, 2028: 80 } },
      { id: "ind_aa2", nome: "% profissionais participando de formações do protocolo Escuta Especializada", metas: { 2025: 5, 2026: 6, 2027: 8, 2028: 10 } },
    ]
  },
  {
    eixoId: "secretaria", diretrizNome: "Apoio às Escolas", indicadores: [
      { id: "ind_ae1", nome: "% UEs visitadas regularmente por tutores/assessores pedagógicos", metas: { 2025: 100, 2026: 100, 2027: 100, 2028: 100 } },
    ]
  },
  {
    eixoId: "secretaria", diretrizNome: "Governança e Implementação", indicadores: [
      { id: "ind_gov1", nome: "% marcos de entregas acompanhados e entregues dentro do prazo", metas: { 2025: 100, 2026: 100, 2027: 100, 2028: 100 } },
    ]
  },
  {
    eixoId: "secretaria", diretrizNome: "Visão de Rede", indicadores: [
      { id: "ind_vr1", nome: "% gestores escolares participando dos encontros bimestrais", metas: { 2025: null, 2026: 80, 2027: 80, 2028: 80 } },
    ]
  },
  {
    eixoId: "secretaria", diretrizNome: "Equipe Qualificada", indicadores: [
      { id: "ind_eq1", nome: "% participação das equipes nas formações continuadas", metas: { 2025: null, 2026: 90, 2027: 90, 2028: 90 } },
    ]
  },
  {
    eixoId: "secretaria", diretrizNome: "Eficiência de Gestão", indicadores: [
      { id: "ind_eg1", nome: "% diretorias com mapeamento de processos realizados e implementados", metas: { 2025: 100, 2026: 100, 2027: 100, 2028: 100 } },
    ]
  },
  {
    eixoId: "secretaria", diretrizNome: "Colaboração entre Entes Federados", indicadores: [
      { id: "ind_cef1", nome: "% turmas de Anos Iniciais municipalizadas", metas: { 2025: null, 2026: 20, 2027: 40, 2028: 60 } },
      { id: "ind_cef2", nome: "% turmas de Anos Finais estadualizadas", metas: { 2025: null, 2026: 25, 2027: 50, 2028: 75 } },
    ]
  },
  {
    eixoId: "tecnologia", diretrizNome: "Tecnologia", indicadores: [
      { id: "ind_tec1", nome: "% UEs com infraestrutura tecnológica adequada", metas: { 2025: null, 2026: 70, 2027: 100, 2028: 100 } },
      { id: "ind_tec2", nome: "% UEs com recursos digitais aplicados em práticas pedagógicas", metas: { 2025: null, 2026: 40, 2027: 80, 2028: 100 } },
    ]
  },
];

// Indicadores storage handled by Supabase functions above

function classifyAtingimento(pct) {
  if (pct >= 100) return { label: "Atingido com sucesso", cor: "#16A34A", bg: "#DCFCE7" };
  if (pct >= 90) return { label: "Atingido", cor: "#2563EB", bg: "#DBEAFE" };
  if (pct >= 75) return { label: "Parcialmente atingido", cor: "#D97706", bg: "#FEF3C7" };
  return { label: "Não atingido", cor: "#DC2626", bg: "#FEE2E2" };
}

// ══════════════════════════════════════════════════════════════════════════════
// INDICADORES TAB COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function calcMcAtingimento(mc, resultado) {
  if (resultado === null || resultado === undefined || resultado === "") return null;
  const val = parseFloat(resultado);
  if (isNaN(val)) return null;
  if (mc.tipo === "ranking") {
    if (val <= 0) return null;
    return Math.min(100, Math.round((mc.objetivo / val) * 100));
  }
  return Math.min(100, Math.round((val / mc.objetivo) * 100));
}

function classifyMc(pct) {
  if (pct === null) return null;
  if (pct >= 95) return { label: "Atingido", cor: "#16A34A", bg: "#DCFCE7" };
  return { label: "Não atingido", cor: "#DC2626", bg: "#FEE2E2" };
}

function MetasChaveSection({ indState, onIndUpdate, isAdmin }) {
  const ANOS = [2025, 2026, 2027, 2028];
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0C2340", margin: "0 0 6px" }}>Metas-Chave da Gestão (2025–2028)</h2>
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 16px" }}>5 metas vinculadas ao eixo central do Floripa Mais Aprendizagem. Classificação: ≥95% da meta → Atingido.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {METAS_CHAVE.map(mc => {
          return (
            <div key={mc.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", background: "#EEF2FA" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 14 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#1F3D7A" }}>{mc.num}</span>
                </div>
                <div style={{ padding: "10px 14px 10px 0" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D7A" }}>{mc.titulo}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{mc.descricao}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 5, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, color: "#1F3D7A", background: "#dde5f5", padding: "1px 8px", borderRadius: 99, fontWeight: 600 }}>{mc.etapa}</span>
                    <span style={{ fontSize: 10, color: "#555", background: "#f0f0f0", padding: "1px 8px", borderRadius: 99, fontWeight: 600 }}>
                      {mc.tipo === "ranking" ? `Meta: ≤ ${mc.objetivo}${mc.unidade} entre ${mc.limite} capitais` : `Meta: ${mc.objetivo}${mc.unidade}`}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e5e7eb" }}>
                {ANOS.map(ano => {
                  const key = `${mc.id}_${ano}`;
                  const val = indState[key] || {};
                  const resultado = val.resultado;
                  const pct = calcMcAtingimento(mc, resultado);
                  const classif = classifyMc(pct);
                  return (
                    <div key={ano} style={{ padding: "12px 14px", borderRight: ano < 2028 ? "1px solid #f0f0f0" : "none" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 8 }}>{ano}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                        <input
                          type="number"
                          min={mc.tipo === "ranking" ? 1 : 0}
                          max={mc.tipo === "ranking" ? mc.limite : 100}
                          step={mc.tipo === "ranking" ? 1 : 0.1}
                          value={resultado !== undefined && resultado !== null && resultado !== "" ? resultado : ""}
                          onChange={e => onIndUpdate(key, { ...val, resultado: e.target.value === "" ? null : (mc.tipo === "ranking" ? parseInt(e.target.value) : parseFloat(e.target.value)) })}
                          disabled={!isAdmin}
                          placeholder="—"
                          style={{ width: mc.tipo === "ranking" ? 48 : 56, fontSize: 14, padding: "6px 8px", border: "1.5px solid #d1d5db", borderRadius: 6, outline: "none", textAlign: mc.tipo === "ranking" ? "center" : "right", fontWeight: 700 }}
                        />
                        <span style={{ fontSize: 12, color: "#888" }}>{mc.unidade}</span>
                      </div>
                      {classif && (
                        <div>
                          <div style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>{pct}% da meta</div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: classif.cor, background: classif.bg, padding: "3px 10px", borderRadius: 99, border: `1px solid ${classif.cor}33`, display: "inline-block" }}>
                            {classif.label}
                          </span>
                        </div>
                      )}
                      <input
                        value={val.notas || ""}
                        onChange={e => onIndUpdate(key, { ...val, notas: e.target.value })}
                        disabled={!isAdmin}
                        placeholder={isAdmin ? "Observação..." : ""}
                        style={{ width: "100%", marginTop: 8, fontSize: 11, padding: "4px 6px", border: "1px solid #e8e8e8", borderRadius: 5, outline: "none", color: "#444", boxSizing: "border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IndicadorYearCell({ indicador, ano, indState, onIndUpdate, isAdmin }) {
  const meta = indicador.metas[ano];
  const textoMeta = indicador.textoMetas ? indicador.textoMetas[ano] : null;
  const isTexto = indicador.tipo === "texto";
  const isNA = meta === null && !textoMeta;
  const key = `${indicador.id}_${ano}`;
  const val = indState[key] || {};
  const resultado = val.resultado;

  let pct = null;
  let classif = null;
  if (!isTexto && meta !== null && resultado !== undefined && resultado !== "" && resultado !== null) {
    pct = Math.round((parseFloat(resultado) / meta) * 100);
    classif = classifyAtingimento(pct);
  }

  // For text indicators, allow manual status
  const textoStatus = val.textoStatus || "";

  return (
    <td style={{ padding: "8px 8px", borderRight: "1px solid #f0f0f0", verticalAlign: "top", minWidth: 130 }}>
      {/* Meta */}
      <div style={{ fontSize: 11, color: isNA ? "#ccc" : "#444", marginBottom: 6, fontStyle: isNA ? "italic" : "normal" }}>
        <span style={{ fontWeight: 600, color: "#888" }}>Meta: </span>
        {isNA ? "N/A" : (isTexto ? (textoMeta || "—") : `${meta}%`)}
      </div>
      {/* Resultado input */}
      {isNA ? (
        <div style={{ fontSize: 11, color: "#ddd", fontStyle: "italic" }}>N/A</div>
      ) : isTexto ? (
        <div>
          <input
            value={resultado || ""}
            onChange={e => onIndUpdate(key, { ...val, resultado: e.target.value })}
            placeholder="Resultado..."
            style={{ width: "100%", fontSize: 11, padding: "4px 6px", border: "1px solid #ddd", borderRadius: 5, outline: "none", boxSizing: "border-box", marginBottom: 4 }}
          />
          <select
            value={textoStatus}
            onChange={e => onIndUpdate(key, { ...val, textoStatus: e.target.value })}
            style={{ width: "100%", fontSize: 10, padding: "3px 5px", border: "1px solid #ddd", borderRadius: 5, background: "white", cursor: "pointer", outline: "none" }}
          >
            <option value="">Classificar...</option>
            <option value="atingido-sucesso">Atingido com sucesso</option>
            <option value="atingido">Atingido</option>
            <option value="parcial">Parcialmente atingido</option>
            <option value="nao-atingido">Não atingido</option>
          </select>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input
              type="number"
              value={resultado !== undefined && resultado !== null ? resultado : ""}
              onChange={e => onIndUpdate(key, { ...val, resultado: e.target.value === "" ? null : parseFloat(e.target.value) })}
              disabled={!isAdmin}
              placeholder="—"
              style={{ width: 55, fontSize: 12, padding: "4px 6px", border: "1px solid #ddd", borderRadius: 5, outline: "none", textAlign: "right" }}
            />
            <span style={{ fontSize: 11, color: "#888" }}>%</span>
          </div>
          {classif && (
            <div style={{ marginTop: 5 }}>
              <div style={{ fontSize: 10, color: "#888" }}>{pct}% da meta</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: classif.cor, background: classif.bg, padding: "2px 7px", borderRadius: 99, border: `1px solid ${classif.cor}33`, display: "inline-block", marginTop: 2 }}>
                {classif.label}
              </span>
            </div>
          )}
        </div>
      )}
    </td>
  );
}

function IndDiretrizBlock({ dir, eixo, indState, onIndUpdate, isAdmin }) {
  const [expanded, setExpanded] = useState(true);
  const ANOS = [2025, 2026, 2027, 2028];
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ background: eixo.corClaro, padding: "8px 14px", borderBottom: expanded ? "1px solid #e5e7eb" : "none", cursor: "pointer", userSelect: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: eixo.cor }}>{dir.diretrizNome}</span>
        <span style={{ fontSize: 12, color: eixo.cor, transform: expanded ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
      </div>
      {expanded && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.04em", width: "30%", borderBottom: "1px solid #e5e7eb" }}>Indicador</th>
                {ANOS.map(a => (
                  <th key={a} style={{ padding: "6px 8px", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", borderBottom: "1px solid #e5e7eb", minWidth: 130 }}>{a}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dir.indicadores.map(ind => (
                <tr key={ind.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#333", lineHeight: 1.4, verticalAlign: "top", borderRight: "1px solid #f0f0f0" }}>
                    {ind.nome}
                    {ind.tipo === "texto" && <span style={{ display: "block", fontSize: 10, color: "#aaa", fontStyle: "italic", marginTop: 2 }}>Classificação manual</span>}
                  </td>
                  {ANOS.map(a => (
                    <IndicadorYearCell key={a} indicador={ind} ano={a} indState={indState} onIndUpdate={onIndUpdate} isAdmin={isAdmin} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function IndEixoBlock({ eixo, dirs, indState, onIndUpdate, isAdmin }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ marginBottom: 24 }}>
      <div onClick={() => setExpanded(!expanded)} style={{ padding: "10px 16px", background: eixo.cor, borderRadius: expanded ? "8px 8px 0 0" : 8, cursor: "pointer", userSelect: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "white" }}>{eixo.nome}</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{dirs.length} diretrizes</span>
        </div>
        <span style={{ fontSize: 14, color: "white", transform: expanded ? "rotate(180deg)" : "rotate(0)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
      </div>
      {expanded && (
        <div style={{ border: `1px solid ${eixo.cor}44`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
          {dirs.map((dir, di) => (
            <IndDiretrizBlock key={di} dir={dir} eixo={eixo} indState={indState} onIndUpdate={onIndUpdate} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}

function IndicadoresDiretrizSection({ indState, onIndUpdate, isAdmin }) {
  const grouped = useMemo(() => {
    const map = {};
    INDICADORES_DIRETRIZ.forEach(d => {
      if (!map[d.eixoId]) map[d.eixoId] = [];
      map[d.eixoId].push(d);
    });
    return map;
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0C2340", margin: "0 0 6px" }}>Indicadores por Diretriz</h2>
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 16px" }}>Meta ano a ano e acompanhamento de resultado. Classificação automática para indicadores numéricos.</p>
      {EIXOS.map(eixo => {
        const dirs = grouped[eixo.id];
        if (!dirs) return null;
        return <IndEixoBlock key={eixo.id} eixo={eixo} dirs={dirs} indState={indState} onIndUpdate={onIndUpdate} isAdmin={isAdmin} />;
      })}
    </div>
  );
}

function IndicadoresTab({ indState, onIndUpdate, isAdmin }) {
  return (
    <div>
      <MetasChaveSection indState={indState} onIndUpdate={onIndUpdate} isAdmin={isAdmin} />
      <IndicadoresDiretrizSection indState={indState} onIndUpdate={onIndUpdate} isAdmin={isAdmin} />
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// MONITORAMENTO TAB
// ══════════════════════════════════════════════════════════════════════════════

function MonitoramentoTab({ eixosData, marcoState, indState }) {
  const [selectedAno, setSelectedAno] = useState(2025);
  const [filAlertArea, setFilAlertArea] = useState("");
  const ANOS = [2025, 2026, 2027, 2028];
  const CURRENT_MES = 6;
  const CURRENT_ANO = 2026;

  function parseAreasLocal(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    return raw.split(/\s+e\s+|\s*\+\s*|\s*,\s*/).map(s => s.trim()).filter(Boolean);
  }

  // ── Parse all marcos with metadata ──
  const allMarcosFlat = useMemo(() => {
    const result = [];
    eixosData.forEach(eixo => {
      eixo.diretrizes.forEach(dir => {
        dir.marcos.forEach(m => {
          const ms = marcoState[m.id] || {};
          const prazoEfetivo = ms.prazo && ms.prazo !== "" ? ms.prazo : m.prazoOriginal;
          const parsed = prazoEfetivo === "OK" ? { mes: 1, ano: 2025 } : parsePrazo(prazoEfetivo);
          const areasResolvidas = ms.areas !== undefined ? ms.areas : parseAreasLocal(m.responsavel);
          result.push({
            ...m, eixoId: eixo.id, eixoNome: eixo.nome, eixoCor: eixo.cor,
            diretrizNome: dir.nome, status: ms.status || "nao-iniciado",
            prazoEfetivo, parsed, areasResolvidas,
          });
        });
      });
    });
    return result;
  }, [eixosData, marcoState]);

  // ── Marcos per year per eixo ──
  const marcosByYearEixo = useMemo(() => {
    const map = {};
    ANOS.forEach(a => { map[a] = {}; EIXOS.forEach(e => { map[a][e.id] = { total: 0, concluidos: 0, inviabilizados: 0 }; }); });
    allMarcosFlat.forEach(m => {
      if (!m.parsed) return;
      const a = m.parsed.ano;
      if (!map[a] || !map[a][m.eixoId]) return;
      map[a][m.eixoId].total++;
      if (m.status === "concluido") map[a][m.eixoId].concluidos++;
      if (m.status === "inviabilizado") map[a][m.eixoId].inviabilizados++;
    });
    return map;
  }, [allMarcosFlat]);

  // ── Indicator achievement per year per eixo ──
  const indByYearEixo = useMemo(() => {
    const map = {};
    ANOS.forEach(a => { map[a] = {}; EIXOS.forEach(e => { map[a][e.id] = { sum: 0, count: 0 }; }); });
    INDICADORES_DIRETRIZ.forEach(dir => {
      dir.indicadores.forEach(ind => {
        ANOS.forEach(ano => {
          const meta = ind.metas[ano];
          if (meta === null || meta === undefined) return;
          const key = `${ind.id}_${ano}`;
          const val = indState[key];
          if (!val || val.resultado === null || val.resultado === undefined || val.resultado === "") return;
          const resultado = parseFloat(val.resultado);
          if (isNaN(resultado)) return;
          const pct = Math.min(100, Math.round((resultado / meta) * 100));
          if (map[ano][dir.eixoId]) {
            map[ano][dir.eixoId].sum += pct;
            map[ano][dir.eixoId].count++;
          }
        });
      });
    });
    return map;
  }, [indState]);

  // ── Computed values for selected year ──
  const yearMarcos = marcosByYearEixo[selectedAno] || {};
  const yearInd = indByYearEixo[selectedAno] || {};

  const totalMarcosAno = Object.values(yearMarcos).reduce((a, e) => a + e.total, 0);
  const concluidosAno = Object.values(yearMarcos).reduce((a, e) => a + e.concluidos, 0);
  const inviabAno = Object.values(yearMarcos).reduce((a, e) => a + e.inviabilizados, 0);
  const pctConclusao = (totalMarcosAno - inviabAno) > 0 ? Math.round((concluidosAno / (totalMarcosAno - inviabAno)) * 100) : 0;

  const totalIndSum = Object.values(yearInd).reduce((a, e) => a + e.sum, 0);
  const totalIndCount = Object.values(yearInd).reduce((a, e) => a + e.count, 0);
  const pctAtingimento = totalIndCount > 0 ? Math.min(100, Math.round(totalIndSum / totalIndCount)) : null;

  // ── Alerts: overdue marcos ──
  const alertas = useMemo(() => {
    const criticos = [];
    const atrasados = [];
    allMarcosFlat.forEach(m => {
      if (!m.parsed) return;
      if (m.prazoEfetivo === "OK") return;
      const overdue = m.parsed.ano < CURRENT_ANO || (m.parsed.ano === CURRENT_ANO && m.parsed.mes < CURRENT_MES);
      if (!overdue) return;
      const mesesAtraso = (CURRENT_ANO - m.parsed.ano) * 12 + (CURRENT_MES - m.parsed.mes);
      const item = { ...m, mesesAtraso };
      if (m.status === "nao-iniciado") criticos.push(item);
      else if (m.status === "em-andamento") atrasados.push(item);
    });
    criticos.sort((a, b) => b.mesesAtraso - a.mesesAtraso);
    atrasados.sort((a, b) => b.mesesAtraso - a.mesesAtraso);
    return { criticos, atrasados };
  }, [allMarcosFlat]);

  function ProgressBar({ value, color, height }) {
    return (
      <div style={{ width: "100%", height: height || 8, borderRadius: 4, background: "#e5e7eb", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, value || 0)}%`, height: "100%", background: color || "#3B82F6", borderRadius: 4, transition: "width 0.4s" }} />
      </div>
    );
  }

  return (
    <div>
      {/* Year selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>Ano:</span>
        {ANOS.map(a => (
          <button key={a} onClick={() => setSelectedAno(a)} style={{
            padding: "7px 20px", fontSize: 14, fontWeight: selectedAno === a ? 800 : 500,
            border: selectedAno === a ? "2px solid #0C2340" : "1.5px solid #d1d5db",
            borderRadius: 8, background: selectedAno === a ? "#0C2340" : "white",
            color: selectedAno === a ? "white" : "#555", cursor: "pointer",
          }}>
            {a}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8 }}>Atingimento das Metas</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: pctAtingimento !== null ? (pctAtingimento >= 90 ? "#16A34A" : pctAtingimento >= 75 ? "#D97706" : "#DC2626") : "#ccc" }}>
            {pctAtingimento !== null ? `${pctAtingimento}%` : "—"}
          </div>
          <div style={{ marginTop: 6 }}><ProgressBar value={pctAtingimento} color={pctAtingimento >= 90 ? "#16A34A" : pctAtingimento >= 75 ? "#D97706" : "#DC2626"} /></div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{totalIndCount} indicadores de diretrizes em {selectedAno}</div>
        </div>
        <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8 }}>Conclusão dos Marcos</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: pctConclusao >= 90 ? "#16A34A" : pctConclusao >= 50 ? "#D97706" : "#DC2626" }}>
            {pctConclusao}%
          </div>
          <div style={{ marginTop: 6 }}><ProgressBar value={pctConclusao} color={pctConclusao >= 90 ? "#16A34A" : pctConclusao >= 50 ? "#D97706" : "#DC2626"} /></div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{concluidosAno} de {totalMarcosAno - inviabAno} marcos em {selectedAno}</div>
        </div>
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#DC2626", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8 }}>Criticamente Atrasados</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#DC2626" }}>{alertas.criticos.length}</div>
          <div style={{ fontSize: 11, color: "#B91C1C", marginTop: 10 }}>Prazo expirado + Não Iniciado</div>
        </div>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: "#B45309", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 8 }}>Atrasados</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#B45309" }}>{alertas.atrasados.length}</div>
          <div style={{ fontSize: 11, color: "#92400E", marginTop: 10 }}>Prazo expirado + Em Andamento</div>
        </div>
      </div>

      {/* Metas-Chave da Gestão */}
      <div style={{ background: "linear-gradient(135deg, #0C2340 0%, #1A4175 100%)", borderRadius: 12, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>Metas-Chave da Gestão — {selectedAno}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {METAS_CHAVE.map(mc => {
            const key = `${mc.id}_${selectedAno}`;
            const val = indState[key] || {};
            const resultado = val.resultado;
            const hasResult = resultado !== null && resultado !== undefined && resultado !== "";
            return (
              <div key={mc.id} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 9, padding: "14px 14px 12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#00BCD4", background: "rgba(0,188,212,0.15)", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{mc.num}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.25 }}>{mc.titulo}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: hasResult ? "white" : "rgba(255,255,255,0.2)" }}>
                    {hasResult ? `${resultado}` : "—"}
                  </div>
                  {hasResult && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{mc.unidade}</span>}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 8, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 6 }}>
                  {mc.tipo === "ranking" ? `Meta: ≤ ${mc.objetivo}${mc.unidade}` : `Meta: ${mc.objetivo}${mc.unidade}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-eixo breakdown */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#0C2340" }}>Visão por Eixo — {selectedAno}</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase" }}>Eixo</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", width: 200 }}>% Atingimento Metas</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", width: 200 }}>% Conclusão Marcos</th>
              <th style={{ padding: "10px 16px", textAlign: "center", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", width: 120 }}>Marcos</th>
            </tr>
          </thead>
          <tbody>
            {EIXOS.map(eixo => {
              const em = yearMarcos[eixo.id] || { total: 0, concluidos: 0, inviabilizados: 0 };
              const ei = yearInd[eixo.id] || { sum: 0, count: 0 };
              const ePctConc = (em.total - em.inviabilizados) > 0 ? Math.round((em.concluidos / (em.total - em.inviabilizados)) * 100) : 0;
              const ePctInd = ei.count > 0 ? Math.min(100, Math.round(ei.sum / ei.count)) : null;
              return (
                <tr key={eixo.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: eixo.cor, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{eixo.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={ePctInd} color={eixo.cor} height={6} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: ePctInd !== null ? "#222" : "#ccc", minWidth: 36, textAlign: "right" }}>
                        {ePctInd !== null ? `${ePctInd}%` : "—"}
                      </span>
                    </div>
                    {ei.count > 0 && <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>{ei.count} indicador{ei.count > 1 ? "es" : ""} com resultado</div>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1 }}><ProgressBar value={ePctConc} color={ePctConc >= 90 ? "#16A34A" : ePctConc >= 50 ? "#D97706" : em.total > 0 ? "#DC2626" : "#e5e7eb"} height={6} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: em.total > 0 ? "#222" : "#ccc", minWidth: 36, textAlign: "right" }}>
                        {em.total > 0 ? `${ePctConc}%` : "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{em.concluidos}/{em.total - em.inviabilizados}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Alerts */}
      <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0C2340" }}>Marcos de Entrega em Atraso</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>Filtrar por diretoria:</span>
            <button onClick={() => setFilAlertArea("")} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: filAlertArea === "" ? "1.5px solid #0C2340" : "1px solid #d1d5db", background: filAlertArea === "" ? "#0C2340" : "white", color: filAlertArea === "" ? "white" : "#555", fontWeight: filAlertArea === "" ? 700 : 400, cursor: "pointer" }}>Todas</button>
            {AREAS_FIXAS.map(a => (
              <button key={a} onClick={() => setFilAlertArea(a)} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: filAlertArea === a ? "1.5px solid #0C2340" : "1px solid #d1d5db", background: filAlertArea === a ? "#0C2340" : "white", color: filAlertArea === a ? "white" : "#555", fontWeight: filAlertArea === a ? 700 : 400, cursor: "pointer" }}>{a}</button>
            ))}
          </div>
        </div>
      </div>

      {(() => {
        const filtCriticos = filAlertArea ? alertas.criticos.filter(m => m.areasResolvidas.includes(filAlertArea)) : alertas.criticos;
        const filtAtrasados = filAlertArea ? alertas.atrasados.filter(m => m.areasResolvidas.includes(filAlertArea)) : alertas.atrasados;
        return (
          <>
            {filtCriticos.length > 0 && (
              <div style={{ background: "white", border: "1px solid #FECACA", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "12px 18px", background: "#FEF2F2", borderBottom: "1px solid #FECACA", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🔴</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#DC2626" }}>Criticamente Atrasados</span>
                  <span style={{ fontSize: 12, color: "#B91C1C" }}>— Prazo expirado e Não Iniciado ({filtCriticos.length})</span>
                </div>
                <div>
                  {filtCriticos.map((m, i) => (
                    <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 90px", padding: "10px 18px", borderBottom: i < filtCriticos.length - 1 ? "1px solid #f5f5f5" : "none", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12.5, color: "#222" }}>{m.descricao}</div>
                        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{m.eixoNome} → {m.diretrizNome}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                        {m.areasResolvidas.map(a => <span key={a} style={{ fontSize: 10, background: "#f0f4ff", color: "#1F3D7A", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{a}</span>)}
                      </div>
                      <div style={{ fontSize: 12, color: "#888" }}>{m.prazoEfetivo}</div>
                      <div><span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 8px", borderRadius: 99 }}>{m.mesesAtraso} {m.mesesAtraso === 1 ? "mês" : "meses"}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filtAtrasados.length > 0 && (
              <div style={{ background: "white", border: "1px solid #FDE68A", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ padding: "12px 18px", background: "#FFFBEB", borderBottom: "1px solid #FDE68A", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>🟡</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: "#B45309" }}>Atrasados</span>
                  <span style={{ fontSize: 12, color: "#92400E" }}>— Prazo expirado e Em Andamento ({filtAtrasados.length})</span>
                </div>
                <div>
                  {filtAtrasados.map((m, i) => (
                    <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 90px 90px", padding: "10px 18px", borderBottom: i < filtAtrasados.length - 1 ? "1px solid #f5f5f5" : "none", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 12.5, color: "#222" }}>{m.descricao}</div>
                        <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{m.eixoNome} → {m.diretrizNome}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                        {m.areasResolvidas.map(a => <span key={a} style={{ fontSize: 10, background: "#f0f4ff", color: "#1F3D7A", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{a}</span>)}
                      </div>
                      <div style={{ fontSize: 12, color: "#888" }}>{m.prazoEfetivo}</div>
                      <div><span style={{ fontSize: 11, fontWeight: 700, color: "#B45309", background: "#FEF3C7", padding: "2px 8px", borderRadius: 99 }}>{m.mesesAtraso} {m.mesesAtraso === 1 ? "mês" : "meses"}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filtCriticos.length === 0 && filtAtrasados.length === 0 && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "20px 18px", textAlign: "center" }}>
                <span style={{ fontSize: 14, color: "#16A34A", fontWeight: 600 }}>
                  {filAlertArea ? `Nenhum marco atrasado para ${filAlertArea}` : "Nenhum marco atrasado no momento"}
                </span>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP WITH TAB NAVIGATION
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [isAdmin, setIsAdmin] = useState(null); // null = checking, true = admin, false = viewer
  const [activeTab, setActiveTab] = useState("monitoramento");
  const [eixosData, setEixosData] = useState(EIXOS);
  const [marcoState, setMarcoState] = useState({});
  const [indState, setIndState] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  // ── Check existing session on mount ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(session ? true : null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) setIsAdmin(prev => prev === true ? false : prev);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load all data from Supabase on mount and auth change ──
  useEffect(() => {
    if (isAdmin === null) return;
    setDataLoaded(false);
    setMarcoState({});
    setIndState({});
    setEixosData(EIXOS);
    async function loadAll() {
      const [marcos, indicadores, customMarcos] = await Promise.all([
        loadMarcosFromDB(),
        loadIndicadoresFromDB(),
        loadCustomMarcosFromDB(),
      ]);
      setMarcoState(marcos);
      setIndState(indicadores);
      // Merge custom marcos into eixosData
      if (customMarcos.length > 0) {
        setEixosData(() => {
          let updated = EIXOS.map(e => ({ ...e, diretrizes: e.diretrizes.map(d => ({ ...d, marcos: [...d.marcos] })) }));
          customMarcos.forEach(cm => {
            const eixo = updated.find(e => e.id === cm.eixo_id);
            if (!eixo) return;
            const dir = eixo.diretrizes.find(d => d.id === cm.diretriz_id);
            if (!dir) return;
            if (dir.marcos.some(m => m.id === cm.id)) return;
            dir.marcos.push({ id: cm.id, ordem: cm.ordem, descricao: cm.descricao, responsavel: cm.responsavel, prazoOriginal: cm.prazo_original });
          });
          return updated;
        });
      }
      setDataLoaded(true);
    }
    loadAll();
  }, [isAdmin]);
  const [filStatus, setFilStatus] = useState([]);
  const [filEixo, setFilEixo] = useState([]);
  const [filArea, setFilArea] = useState([]);
  const [filAno, setFilAno] = useState([]);
  const [filMes, setFilMes] = useState([]);
  const [filOrigem, setFilOrigem] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIds, setNewIds] = useState(new Set());
  const [deletingMarco, setDeletingMarco] = useState(null);  // marco object being deleted
  const [editingMarco, setEditingMarco] = useState(null);    // marco object being edited

  // Saves happen per-update via Supabase functions below

  function handleUpdate(marcoId, newS) {
    setMarcoState(prev => ({ ...prev, [marcoId]: newS }));
    saveMarcoDB(marcoId, newS);
  }
  function handleIndUpdate(key, val) {
    setIndState(prev => ({ ...prev, [key]: val }));
    saveIndicadorDB(key, val);
  }

  function handleAddMarco({ eixoId, diretrizId, descricao, responsavel, prazo }) {
    const newId = `custom_${Date.now()}`;
    setEixosData(prev => prev.map(e => {
      if (e.id !== eixoId) return e;
      return {
        ...e, diretrizes: e.diretrizes.map(d => {
          if (d.id !== diretrizId) return d;
          const maxOrdem = d.marcos.reduce((max, m) => Math.max(max, m.ordem), 0);
          const newOrdem = maxOrdem + 1;
          saveCustomMarcoDB({ id: newId, eixo_id: eixoId, diretriz_id: diretrizId, descricao, responsavel, prazo_original: prazo, ordem: newOrdem });
          return { ...d, marcos: [...d.marcos, { id: newId, ordem: newOrdem, descricao, responsavel, prazoOriginal: prazo }] };
        })
      };
    }));
    setNewIds(prev => new Set([...prev, newId]));
  }

  async function handleDeleteMarco(marco) {
    // Remove from Supabase
    await supabase.from("marcos_custom").delete().eq("id", marco.id);
    await supabase.from("marcos_state").delete().eq("id", marco.id);
    // Remove from local state
    setEixosData(prev => prev.map(e => ({
      ...e,
      diretrizes: e.diretrizes.map(d => ({
        ...d,
        marcos: d.marcos.filter(m => m.id !== marco.id)
      }))
    })));
    setMarcoState(prev => {
      const next = { ...prev };
      delete next[marco.id];
      return next;
    });
    setNewIds(prev => { const next = new Set(prev); next.delete(marco.id); return next; });
    setDeletingMarco(null);
  }

  async function handleEditMarco({ eixoId, diretrizId, descricao, responsavel, prazo }) {
    if (!editingMarco) return;
    const id = editingMarco.id;
    // Find original eixo/diretriz location
    let origEixoId = null, origDiretrizId = null;
    eixosData.forEach(e => e.diretrizes.forEach(d => { if (d.marcos.some(m => m.id === id)) { origEixoId = e.id; origDiretrizId = d.id; } }));
    // Persist to Supabase
    await supabase.from("marcos_custom").update({ eixo_id: eixoId, diretriz_id: diretrizId, descricao, responsavel, prazo_original: prazo }).eq("id", id);
    // Update local eixosData (handle possible eixo/diretriz change)
    setEixosData(prev => {
      let updated = prev.map(e => ({
        ...e,
        diretrizes: e.diretrizes.map(d => ({
          ...d,
          marcos: d.marcos.filter(m => m.id !== id)
        }))
      }));
      updated = updated.map(e => {
        if (e.id !== eixoId) return e;
        return {
          ...e,
          diretrizes: e.diretrizes.map(d => {
            if (d.id !== diretrizId) return d;
            const ordem = editingMarco.ordem;
            return { ...d, marcos: [...d.marcos, { id, ordem, descricao, responsavel, prazoOriginal: prazo }] };
          })
        };
      });
      return updated;
    });
    setEditingMarco(null);
  }

  const hasFilter = filStatus.length || filEixo.length || filArea.length || filAno.length || filMes.length || filOrigem.length || search;

  const filteredEixos = useMemo(() => {
    return eixosData
      .filter(e => filEixo.length === 0 || filEixo.includes(e.id))
      .map(e => ({
        ...e,
        diretrizes: e.diretrizes.map(d => ({
          ...d,
          marcos: d.marcos.filter(m => {
            const st = (marcoState[m.id] || {}).status || "nao-iniciado";
            const prazoEfetivo = (marcoState[m.id] || {}).prazo !== undefined ? (marcoState[m.id] || {}).prazo : m.prazoOriginal;
            const parsed = parsePrazo(prazoEfetivo);
            const marcoAreas = (marcoState[m.id] || {}).areas !== undefined
              ? (marcoState[m.id] || {}).areas
              : (function () {
                const raw = m.responsavel;
                if (!raw) return [];
                if (Array.isArray(raw)) return raw;
                return raw.split(/\s+e\s+|\s*\+\s*|\s*,\s*/).map(s => s.trim()).filter(Boolean);
              })();
            if (filStatus.length && !filStatus.includes(st)) return false;
            if (filArea.length && !filArea.some(a => marcoAreas.includes(a))) return false;
            if (filAno.length && (!parsed || !filAno.includes(String(parsed.ano)))) return false;
            if (filMes.length && (!parsed || !filMes.includes(String(parsed.mes)))) return false;
            if (filOrigem.length) {
              const origem = m.id.startsWith("custom_") ? "adicionado" : "planejado";
              if (!filOrigem.includes(origem)) return false;
            }
            if (search && !m.descricao.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
          })
        })).filter(d => d.marcos.length > 0)
      })).filter(e => e.diretrizes.length > 0);
  }, [filStatus, filEixo, filArea, filAno, filMes, filOrigem, search, marcoState, eixosData]);

  const statusOpts = STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label }));
  const eixoOpts = EIXOS.map(e => ({ value: e.id, label: e.nome }));
  const areaOpts = AREAS_FIXAS.map(a => ({ value: a, label: a }));
  const anoOpts = ["2025", "2026", "2027", "2028", "2029", "2030"].map(a => ({ value: a, label: a }));
  const mesOpts = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((m, i) => ({ value: String(i + 1), label: m }));
  const origemOpts = [{ value: "planejado", label: "Planejado" }, { value: "adicionado", label: "Adicionado" }];
  const statusColorMap = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s.cor]));
  const eixoColorMap = Object.fromEntries(EIXOS.map(e => [e.id, e.cor]));

  const tabs = [
    { id: "monitoramento", label: "Monitoramento do Plano", disabled: false },
    { id: "indicadores", label: "Indicadores", disabled: false },
    { id: "marcos", label: "Marcos de Entrega", disabled: false },
  ];

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#F0F2F5" }}>
      {isAdmin === null && <LoginModal onLogin={setIsAdmin} />}
      {!dataLoaded && isAdmin !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(240,242,245,0.95)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0C2340" }}>Carregando dados...</div>
          </div>
        </div>
      )}
      {showAddModal && <AddMarcoModal eixos={eixosData} onAdd={handleAddMarco} onClose={() => setShowAddModal(false)} />}
      {editingMarco && <AddMarcoModal eixos={eixosData} editingMarco={editingMarco} onAdd={handleEditMarco} onClose={() => setEditingMarco(null)} />}
      {deletingMarco && <DeleteConfirmModal onConfirm={() => handleDeleteMarco(deletingMarco)} onClose={() => setDeletingMarco(null)} />}

      {/* ── Header Institucional ── */}
      <div style={{ background: "linear-gradient(135deg, #0C2340 0%, #1A4175 50%, #1F5C99 100%)", padding: "0 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "16px 0 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <img src={LOGO_PMF} alt="Prefeitura de Florianópolis - Educação" style={{ height: 52, objectFit: "contain", background: "white", borderRadius: 6, padding: "5px 10px" }} />
              <div style={{ height: 36, width: 1, background: "rgba(255,255,255,0.2)" }} />
              <div>
                <h1 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "white", letterSpacing: "-0.01em" }}>FLORIPA MAIS APRENDIZAGEM</h1>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em" }}>PLANO DE AÇÃO · 2025–2030</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isAdmin !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 99, fontWeight: 700, background: isAdmin ? "rgba(22,163,74,0.2)" : "rgba(255,255,255,0.15)", color: isAdmin ? "#86efac" : "rgba(255,255,255,0.6)", border: isAdmin ? "1px solid rgba(22,163,74,0.3)" : "1px solid rgba(255,255,255,0.2)" }}>
                    {isAdmin ? "Admin" : "Visualizador"}
                  </span>
                  {isAdmin && (
                    <button onClick={async () => { await supabase.auth.signOut(); setIsAdmin(false); }} style={{ fontSize: 11, padding: "4px 10px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, cursor: "pointer" }}>Sair</button>
                  )}
                  {!isAdmin && (
                    <button onClick={() => setIsAdmin(null)} style={{ fontSize: 11, padding: "4px 10px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, cursor: "pointer" }}>Login Admin</button>
                  )}
                </div>
              )}
              <button onClick={() => window.open("/Plano_Estrategico_Floripa_Mais_Aprendizagem.pdf", "_blank")} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                📄 Plano Estratégico
              </button>
              {activeTab === "marcos" && isAdmin && (
                <button onClick={() => setShowAddModal(true)} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(4px)" }}>
                  + Novo Marco
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── Cyan accent bar ── */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #00BCD4 0%, #0097A7 40%, #00BCD4 100%)" }} />
      {/* ── Tab bar ── */}
      <div style={{ background: "white", borderBottom: "1px solid #e0e0e0", padding: "0 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                style={{
                  padding: "12px 24px", fontSize: 13, background: "transparent", border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid #00BCD4" : "3px solid transparent",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: tab.disabled ? "#ccc" : activeTab === tab.id ? "#0C2340" : "#888",
                  cursor: tab.disabled ? "default" : "pointer",
                  letterSpacing: "0.02em",
                  transition: "all 0.15s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {EIXOS.map(e => <div key={e.id} style={{ width: 8, height: 8, borderRadius: "50%", background: e.cor }} title={e.nome} />)}
            </div>
            <span style={{ fontSize: 10, color: "#bbb" }}>Documento base: mai/2025</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "20px 24px 60px" }}>
        {activeTab === "marcos" && (
          <>
            <SummaryBar state={marcoState} eixos={eixosData} />
            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0 }}>Filtros</span>
                {hasFilter && (
                  <button onClick={() => { setFilStatus([]); setFilEixo([]); setFilArea([]); setFilAno([]); setFilMes([]); setFilOrigem([]); setSearch(""); }}
                    style={{ fontSize: 11, padding: "3px 10px", border: "1px solid #fca5a5", borderRadius: 20, background: "#FEF2F2", color: "#DC2626", cursor: "pointer", fontWeight: 600 }}>
                    Limpar todos
                  </button>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por texto..."
                  style={{ flex: "1 1 180px", padding: "7px 11px", border: "1px solid #e5e7eb", borderRadius: 7, fontSize: 13, outline: "none" }} />
                <MultiSelect label="Status" options={statusOpts} selected={filStatus} onChange={setFilStatus} colorMap={statusColorMap} />
                <MultiSelect label="Eixo" options={eixoOpts} selected={filEixo} onChange={setFilEixo} colorMap={eixoColorMap} />
                <MultiSelect label="Área responsável" options={areaOpts} selected={filArea} onChange={setFilArea} />
                <MultiSelect label="Ano" options={anoOpts} selected={filAno} onChange={setFilAno} />
                <MultiSelect label="Mês" options={mesOpts} selected={filMes} onChange={setFilMes} />
                <MultiSelect label="Origem" options={origemOpts} selected={filOrigem} onChange={setFilOrigem} />
              </div>
            </div>
            {filteredEixos.length === 0
              ? <div style={{ textAlign: "center", padding: 60, color: "#aaa", fontSize: 15 }}>Nenhum marco encontrado com os filtros selecionados.</div>
              : filteredEixos.map(eixo => <EixoSection key={eixo.id} eixo={eixo} state={marcoState} onUpdate={handleUpdate} newIds={newIds} isAdmin={isAdmin} onEdit={setEditingMarco} onDelete={setDeletingMarco} />)
            }
          </>
        )}
        {activeTab === "indicadores" && (
          <IndicadoresTab indState={indState} onIndUpdate={handleIndUpdate} isAdmin={isAdmin} />
        )}
        {activeTab === "monitoramento" && (
          <MonitoramentoTab eixosData={eixosData} marcoState={marcoState} indState={indState} />
        )}
      </div>
    </div>
  );
}
