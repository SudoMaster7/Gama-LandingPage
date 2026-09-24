/**
 * Ilustrações vetoriais dos produtos.
 *
 * Por que existem: enquanto a GAMA não envia as fotos reais, o catálogo
 * precisa comunicar visualmente o que é cada produto. Um quadrado cinza não
 * vende; uma foto de banco de imagens seria desonesta (regra do projeto:
 * nunca sugerir produto ou estrutura que a empresa não possui).
 *
 * A saída é um desenho próprio, na paleta da marca, claramente ilustrativo —
 * ninguém confunde com fotografia. Assim que a foto real entrar em
 * content/products/<slug>.json, a ilustração dá lugar a ela automaticamente
 * (ver ProductImage.tsx).
 *
 * Para um produto novo sem desenho específico, cai no genérico da família e,
 * em último caso, na caixa — o catálogo nunca fica com buraco visual.
 */

const VERDE = "var(--gama-verde)";
const VERDE_ESC = "var(--gama-verde-escuro)";
const PRETO = "var(--gama-preto)";

type Props = { className?: string };

function Base({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 200 150"
      className={className}
      role="presentation"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      {children}
    </svg>
  );
}

/** Bobina picotada: rolo com folhas destacáveis e o fundo em V da "estrela". */
function BobinaFundoEstrela({ className }: Props) {
  return (
    <Base className={className}>
      {/* rolo */}
      <ellipse cx="60" cy="75" rx="16" ry="38" fill={VERDE_ESC} opacity="0.25" />
      <rect x="60" y="37" width="62" height="76" fill={VERDE} opacity="0.20" />
      <ellipse cx="122" cy="75" rx="16" ry="38" fill={VERDE} opacity="0.55" />
      <ellipse cx="122" cy="75" rx="7" ry="17" fill="white" opacity="0.85" />
      {/* folha destacada, com o fundo em V */}
      <path
        d="M122 44 L168 44 L168 96 L145 112 L122 96 Z"
        fill="white"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M145 112 L145 96" stroke={VERDE_ESC} strokeWidth="2" opacity="0.5" />
      {/* picote */}
      <path
        d="M122 44 L122 96"
        stroke={VERDE_ESC}
        strokeWidth="2"
        strokeDasharray="4 4"
        opacity="0.7"
      />
      {/* alças */}
      <path
        d="M132 44 q6 -11 12 0"
        fill="none"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M150 44 q6 -11 12 0"
        fill="none"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Base>
  );
}

/** Sacola com alça vazada. */
function Sacolas({ className }: Props) {
  return (
    <Base className={className}>
      {/* sacola de trás */}
      <path
        d="M52 56 L104 56 L110 122 L46 122 Z"
        fill={VERDE}
        opacity="0.22"
      />
      {/* sacola da frente */}
      <path
        d="M92 50 L152 50 L158 124 L86 124 Z"
        fill="white"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* vinco */}
      <path d="M122 50 L122 124" stroke={VERDE_ESC} strokeWidth="1.5" opacity="0.3" />
      {/* alça vazada */}
      <path
        d="M104 50 q0 -16 18 -16 q18 0 18 16"
        fill="none"
        stroke={VERDE_ESC}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* faixa da marca */}
      <rect x="96" y="76" width="52" height="12" rx="2" fill={VERDE} opacity="0.75" />
    </Base>
  );
}

/** Filme PVC: caixa dispensadora vista de frente, com filme sendo puxado. */
function FilmePvc({ className }: Props) {
  return (
    <Base className={className}>
      {/* filme puxado saindo por cima — desenhado antes para ficar atrás */}
      <path
        d="M54 62 L150 42 L150 78 L54 92 Z"
        fill="white"
        fillOpacity="0.92"
        stroke={VERDE_ESC}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M86 56 L86 86" stroke={VERDE} strokeWidth="1.5" opacity="0.4" />
      <path d="M118 49 L118 82" stroke={VERDE} strokeWidth="1.5" opacity="0.4" />

      {/* caixa dispensadora, de frente */}
      <rect x="40" y="62" width="120" height="46" rx="3" fill={VERDE} opacity="0.85" />
      {/* tampa */}
      <path d="M40 62 L160 62 L160 72 L40 72 Z" fill={VERDE_ESC} opacity="0.55" />
      {/* rótulo */}
      <rect x="58" y="80" width="84" height="16" rx="2" fill="white" opacity="0.9" />
      <rect x="66" y="85" width="50" height="6" rx="1" fill={VERDE_ESC} opacity="0.55" />
      {/* serrilha na borda inferior */}
      <path
        d="M40 108 l9 7 l9 -7 l9 7 l9 -7 l9 7 l9 -7 l9 7 l9 -7 l9 7 l9 -7 l9 7 l9 -7"
        fill="none"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </Base>
  );
}

/** Filme stretch: palete envolvido pelo filme, com o rolo ao lado. */
function FilmeStretch({ className }: Props) {
  return (
    <Base className={className}>
      {/* caixas do palete */}
      <rect x="44" y="30" width="40" height="34" fill={VERDE} opacity="0.35" />
      <rect x="86" y="30" width="40" height="34" fill={VERDE} opacity="0.22" />
      <rect x="44" y="66" width="40" height="34" fill={VERDE} opacity="0.22" />
      <rect x="86" y="66" width="40" height="34" fill={VERDE} opacity="0.35" />
      {/* filme envolvendo a carga */}
      <rect
        x="40"
        y="26"
        width="90"
        height="78"
        fill="white"
        fillOpacity="0.30"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
      />
      <path
        d="M40 40 q45 12 90 0 M40 58 q45 12 90 0 M40 76 q45 12 90 0 M40 94 q45 12 90 0"
        fill="none"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      {/* palete */}
      <rect x="34" y="106" width="102" height="9" fill={PRETO} opacity="0.55" />
      <rect x="42" y="115" width="13" height="12" fill={PRETO} opacity="0.4" />
      <rect x="78" y="115" width="13" height="12" fill={PRETO} opacity="0.4" />
      <rect x="114" y="115" width="13" height="12" fill={PRETO} opacity="0.4" />
      {/* rolo de stretch ao lado, maior e legível */}
      <rect x="152" y="62" width="30" height="53" rx="4" fill={VERDE} opacity="0.55" />
      <ellipse cx="167" cy="62" rx="15" ry="7" fill={VERDE_ESC} opacity="0.65" />
      <ellipse cx="167" cy="62" rx="6" ry="3" fill="white" opacity="0.95" />
      <ellipse cx="167" cy="115" rx="15" ry="7" fill={VERDE_ESC} opacity="0.35" />
    </Base>
  );
}

/** Saco genérico — usado por sacos de lixo e afins. */
function SacoGenerico({ className }: Props) {
  return (
    <Base className={className}>
      <path
        d="M66 54 q34 -14 68 0 L142 118 q-42 10 -84 0 Z"
        fill="white"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M66 54 q34 12 68 0" fill={VERDE} opacity="0.30" />
      <path
        d="M78 40 q22 -12 44 0"
        fill="none"
        stroke={VERDE_ESC}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <rect x="82" y="78" width="36" height="10" rx="2" fill={VERDE} opacity="0.6" />
    </Base>
  );
}

/** Rolo genérico — qualquer filme ou bobina sem desenho próprio. */
function RoloGenerico({ className }: Props) {
  return (
    <Base className={className}>
      <rect x="62" y="46" width="76" height="58" fill={VERDE} opacity="0.22" />
      <ellipse cx="62" cy="75" rx="14" ry="29" fill={VERDE_ESC} opacity="0.3" />
      <ellipse cx="138" cy="75" rx="14" ry="29" fill={VERDE} opacity="0.55" />
      <ellipse cx="138" cy="75" rx="6" ry="13" fill="white" opacity="0.85" />
      <path
        d="M138 46 L172 40 L172 98 L138 104"
        fill="white"
        fillOpacity="0.85"
        stroke={VERDE_ESC}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </Base>
  );
}

/** Caixa genérica — último recurso, nunca deixa o card vazio. */
function CaixaGenerica({ className }: Props) {
  return (
    <Base className={className}>
      <path d="M60 64 L100 46 L140 64 L100 82 Z" fill={VERDE} opacity="0.45" />
      <path d="M60 64 L100 82 L100 122 L60 104 Z" fill={VERDE_ESC} opacity="0.3" />
      <path d="M140 64 L100 82 L100 122 L140 104 Z" fill={VERDE} opacity="0.2" />
    </Base>
  );
}

/** Desenho específico por produto. A chave é o slug do JSON. */
const PORSLUG: Record<string, (p: Props) => React.ReactElement> = {
  "bobina-fundo-estrela": BobinaFundoEstrela,
  sacolas: Sacolas,
  "filme-pvc": FilmePvc,
  "filme-stretch": FilmeStretch,
};

/** Palavras no slug ou no nome que indicam o desenho genérico adequado. */
const PORPALAVRA: { termos: string[]; comp: (p: Props) => React.ReactElement }[] = [
  { termos: ["stretch", "palete", "pallet"], comp: FilmeStretch },
  { termos: ["bobina", "picotad"], comp: BobinaFundoEstrela },
  { termos: ["sacola", "alca", "alça", "camiseta"], comp: Sacolas },
  { termos: ["filme", "pvc", "bopp", "shrink"], comp: RoloGenerico },
  { termos: ["saco", "lixo", "residuo", "resíduo"], comp: SacoGenerico },
];

/** Genérico por família, quando o nome não diz nada. */
const PORFAMILIA: Record<string, (p: Props) => React.ReactElement> = {
  Filmes: RoloGenerico,
  "Sacos e bobinas": SacoGenerico,
};

export function ProductIllustration({
  slug,
  name,
  family,
  className,
}: {
  slug: string;
  name?: string;
  family?: string;
  className?: string;
}) {
  const especifico = PORSLUG[slug];
  if (especifico) return especifico({ className });

  const texto = `${slug} ${name ?? ""}`.toLowerCase();
  for (const { termos, comp } of PORPALAVRA) {
    if (termos.some((t) => texto.includes(t))) return comp({ className });
  }

  const porFamilia = family ? PORFAMILIA[family] : undefined;
  if (porFamilia) return porFamilia({ className });

  return CaixaGenerica({ className });
}
