import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineTrash,
  HiOutlinePhoto,
  HiOutlineArrowPath,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineViewfinderCircle,
} from 'react-icons/hi2';
import ImageZoomModal from './ImageZoomModal';

export interface BikePartImageTemplate {
  id: string;
  name: string;
  category: string;
  tags: string[];
  imageUrl: string;
  suggestedSku?: string;
  suggestedBrand?: string;
}

// Crisp, stylized SVG data URLs for bicycle components
const createSvgDataUrl = (svgContent: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;

const caliperSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <path d="M50 85C50 70 65 60 85 60H125C145 60 155 75 155 95V125C155 140 140 150 120 150H80C60 150 50 135 50 120V85Z" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
  <rect x="75" y="80" width="50" height="40" rx="8" fill="#334155" stroke="#94A3B8" stroke-width="3"/>
  <circle cx="100" cy="100" r="12" fill="#E2E8F0" stroke="#334155" stroke-width="3"/>
  <path d="M125 50L135 60H115L125 50Z" fill="#EF4444"/>
  <circle cx="68" cy="78" r="5" fill="#94A3B8"/>
  <circle cx="132" cy="132" r="5" fill="#94A3B8"/>
  <path d="M40 100H50M150 100H160" stroke="#64748B" stroke-width="4" stroke-linecap="round"/>
</svg>`);

const rotorSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <circle cx="100" cy="100" r="68" stroke="#334155" stroke-width="12" fill="none"/>
  <circle cx="100" cy="100" r="48" stroke="#94A3B8" stroke-width="3" stroke-dasharray="6 6" fill="none"/>
  <circle cx="100" cy="100" r="24" fill="#E2E8F0" stroke="#1E293B" stroke-width="4"/>
  <circle cx="100" cy="100" r="10" fill="#F8FAFC"/>
  <!-- 6 Rotor Arms -->
  <path d="M100 76V32M100 124V168M79 88L41 66M121 112L159 134M79 112L41 134M121 88L159 66" stroke="#475569" stroke-width="5" stroke-linecap="round"/>
  <!-- Wave Perimeter Cutouts -->
  <circle cx="100" cy="36" r="3.5" fill="#64748B"/>
  <circle cx="155" cy="68" r="3.5" fill="#64748B"/>
  <circle cx="155" cy="132" r="3.5" fill="#64748B"/>
  <circle cx="100" cy="164" r="3.5" fill="#64748B"/>
  <circle cx="45" cy="132" r="3.5" fill="#64748B"/>
  <circle cx="45" cy="68" r="3.5" fill="#64748B"/>
</svg>`);

const padsSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <path d="M60 55C60 48 68 45 75 48L125 48C132 45 140 48 140 55V145C140 152 132 155 125 152L75 152C68 155 60 152 60 145V55Z" fill="#D97706" stroke="#92400E" stroke-width="4"/>
  <rect x="75" y="70" width="50" height="65" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="3"/>
  <circle cx="100" cy="45" r="5" fill="#F8FAFC" stroke="#92400E" stroke-width="2"/>
  <line x1="85" y1="85" x2="115" y2="85" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="85" y1="102" x2="115" y2="102" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
  <line x1="85" y1="120" x2="115" y2="120" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
</svg>`);

const chainSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <g stroke="#CA8A04" stroke-width="4" fill="#FACC15">
    <rect x="35" y="80" width="55" height="40" rx="20"/>
    <rect x="75" y="80" width="55" height="40" rx="20" fill="#EAB308"/>
    <rect x="115" y="80" width="55" height="40" rx="20"/>
  </g>
  <circle cx="50" cy="100" r="8" fill="#1E293B" stroke="#78350F" stroke-width="3"/>
  <circle cx="90" cy="100" r="8" fill="#1E293B" stroke="#78350F" stroke-width="3"/>
  <circle cx="130" cy="100" r="8" fill="#1E293B" stroke="#78350F" stroke-width="3"/>
  <circle cx="150" cy="100" r="8" fill="#1E293B" stroke="#78350F" stroke-width="3"/>
</svg>`);

const cranksetSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <circle cx="95" cy="100" r="62" fill="#0F172A" stroke="#334155" stroke-width="4"/>
  <circle cx="95" cy="100" r="42" fill="#1E293B"/>
  <path d="M95 100L145 155C150 160 158 160 163 155L168 150C173 145 173 137 168 132L110 85Z" fill="#334155" stroke="#475569" stroke-width="3"/>
  <circle cx="160" cy="148" r="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="3"/>
  <circle cx="95" cy="100" r="16" fill="#64748B" stroke="#94A3B8" stroke-width="3"/>
  <circle cx="95" cy="100" r="8" fill="#0F172A"/>
</svg>`);

const handlebarSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <!-- Handlebar, Stem & Fork -->
  <g stroke="#0F172A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <!-- Left Grip -->
    <rect x="24" y="44" width="34" height="18" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="5"/>
    <rect x="58" y="40" width="8" height="26" rx="4" fill="#F97316" stroke="#0F172A" stroke-width="5"/>
    
    <!-- Right Grip -->
    <rect x="142" y="44" width="34" height="18" rx="6" fill="#1E293B" stroke="#0F172A" stroke-width="5"/>
    <rect x="134" y="40" width="8" height="26" rx="4" fill="#F97316" stroke="#0F172A" stroke-width="5"/>

    <!-- Handlebar Arch / Riser Curve -->
    <path d="M66 53H74C84 53 86 78 100 78C114 78 116 53 126 53H134" stroke="#334155" stroke-width="7"/>
    
    <!-- Stem Column -->
    <path d="M100 78V106" stroke="#1E293B" stroke-width="7"/>

    <!-- Fork Crown & Legs -->
    <path d="M84 152V124C84 112 116 112 116 124V152" stroke="#475569" stroke-width="7"/>
    <path d="M80 152H88M112 152H120" stroke="#0F172A" stroke-width="6"/>
  </g>
</svg>`);

const handleGripsSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <rect width="200" height="200" rx="28" fill="#F8FAFC"/>
  <!-- Ergonomic Handle Grips Pair -->
  <g stroke="#0F172A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <!-- Grip 1 -->
    <rect x="36" y="58" width="128" height="34" rx="8" fill="#1E293B"/>
    <rect x="30" y="55" width="12" height="40" rx="3" fill="#EA580C"/>
    <rect x="158" y="55" width="12" height="40" rx="3" fill="#334155"/>
    <path d="M56 64V86M72 64V86M88 64V86M104 64V86M120 64V86M136 64V86" stroke="#64748B" stroke-width="3"/>

    <!-- Grip 2 -->
    <rect x="36" y="112" width="128" height="34" rx="8" fill="#1E293B"/>
    <rect x="30" y="109" width="12" height="40" rx="3" fill="#EA580C"/>
    <rect x="158" y="109" width="12" height="40" rx="3" fill="#334155"/>
    <path d="M56 118V140M72 118V140M88 118V140M104 118V140M120 118V140M136 118V140" stroke="#64748B" stroke-width="3"/>
  </g>
</svg>`);

export const BIKE_PART_TEMPLATES: BikePartImageTemplate[] = [
  {
    id: 'bolids-caliper',
    name: 'Mechanical Disc Brake Caliper',
    category: 'braking-system',
    tags: ['Brakes', 'Caliper', 'Mechanical'],
    imageUrl: '/images/products/bolids-disc-brake-caliper.jpg',
    suggestedSku: 'BLD-180-01',
    suggestedBrand: 'BOLIDS',
  },
  {
    id: 'universal-pads',
    name: 'Disc Brake Pads with Spring',
    category: 'braking-system',
    tags: ['Brakes', 'Pads', 'Resin'],
    imageUrl: '/images/products/universal-disc-brake-pads.jpg',
    suggestedSku: 'PAD-DSK-01',
    suggestedBrand: 'Universal',
  },
  {
    id: 'rotor',
    name: 'Floating disc rotor 160mm',
    category: 'braking-system',
    tags: ['Brakes', 'Rotor'],
    imageUrl: rotorSvg,
    suggestedSku: 'Rtr-160-01',
    suggestedBrand: 'Sram',
  },
  {
    id: 'shimano-chain',
    name: 'CN-HG53 9-Speed Chain (116L)',
    category: 'drivetrain-chains',
    tags: ['Drivetrain', 'Chain', '9-Speed'],
    imageUrl: '/images/products/shimano-cn-hg53-chain.jpg',
    suggestedSku: 'CN-HG53-01',
    suggestedBrand: 'Shimano',
  },
  {
    id: 'bucklos-cassette',
    name: 'Bicycle Cassette',
    category: 'drivetrain-chains',
    tags: ['Drivetrain', 'Cassette', 'Sprocket'],
    imageUrl: '/images/products/bucklos-bicycle-cassette.jpg',
    suggestedSku: 'BCK-CAS-01',
    suggestedBrand: 'BUCKLOS',
  },
  {
    id: 'meroca-pulley',
    name: '13T CNC Jockey Wheel Pulley',
    category: 'drivetrain-chains',
    tags: ['Drivetrain', 'Pulley', 'Jockey', '13T'],
    imageUrl: '/images/products/meroca-13t-jockey-wheel.jpg',
    suggestedSku: 'MRC-13T-01',
    suggestedBrand: 'MEROCA',
  },
  {
    id: 'ragusa-crankset',
    name: 'R-500 1x Crankset with Chainring',
    category: 'drivetrain-chains',
    tags: ['Drivetrain', 'Crankset', 'R-500', 'Chainring'],
    imageUrl: '/images/products/ragusa-r500-crankset.jpg',
    suggestedSku: 'RGS-R500-01',
    suggestedBrand: 'RAGUSA',
  },
  {
    id: 'crankset',
    name: 'Hollowtech II crankset',
    category: 'drivetrain-chains',
    tags: ['Drivetrain', 'Alloy'],
    imageUrl: cranksetSvg,
    suggestedSku: 'Crk-ht2-01',
    suggestedBrand: 'Shimano',
  },
  {
    id: 'inspeed-handlebar',
    name: '6061-T6 Alloy Handlebar (31.8mm)',
    category: 'handle-bar-handle-grip',
    tags: ['Handlebar', 'Alloy', 'Cockpit', '6061-T6'],
    imageUrl: '/images/products/inspeed-alloy-handlebar.jpg',
    suggestedSku: 'INSP-HB-01',
    suggestedBrand: 'INSPEED',
  },
  {
    id: 'universal-purple-lockon-grips',
    name: 'Dual Lock-On Handlebar Grips (Purple)',
    category: 'handle-bar-handle-grip',
    tags: ['Grip', 'Handlebar', 'Purple', 'Lock-On', 'Cockpit'],
    imageUrl: '/images/products/universal-purple-lock-on-grips.jpg',
    suggestedSku: 'GRP-LCK-PRP-01',
    suggestedBrand: 'Universal',
  },
  {
    id: 'handlebar',
    name: 'Alloy Riser Handlebar 780mm',
    category: 'handle-bar-handle-grip',
    tags: ['Handlebar', 'Handle', 'Cockpit'],
    imageUrl: handlebarSvg,
    suggestedSku: 'Hbr-780-01',
    suggestedBrand: 'Spank',
  },
  {
    id: 'grips',
    name: 'Ergonomic Lock-On Handle Grips',
    category: 'handle-bar-handle-grip',
    tags: ['Grip', 'Handlebar', 'Cockpit'],
    imageUrl: handleGripsSvg,
    suggestedSku: 'Grp-lck-01',
    suggestedBrand: 'ODI',
  },
];

interface PartImagePickerProps {
  selectedImage: string;
  onSelectImage: (imageUrl: string, template?: BikePartImageTemplate) => void;
  onRemoveImage: () => void;
}

export const PartImagePicker: React.FC<PartImagePickerProps> = ({
  selectedImage,
  onSelectImage,
  onRemoveImage,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [lensModalOpen, setLensModalOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(!selectedImage);

  // Interactive Loupe State for hover inspection
  const [isHovering, setIsHovering] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0, bgX: 0, bgY: 0 });
  const thumbRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = BIKE_PART_TEMPLATES.find((t) => t.imageUrl === selectedImage);
  const selectedTitle = selectedTemplate ? selectedTemplate.name : 'Custom uploaded bike part';

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onSelectImage(reader.result as string);
      setShowLibrary(false);
    };
    reader.readAsDataURL(file);
  };

  // Loupe Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!thumbRef.current) return;
    const rect = thumbRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setLoupePos({ x, y, bgX, bgY });
  };

  // Filter templates
  const filteredTemplates = BIKE_PART_TEMPLATES.filter((t) => {
    const matchesFilter =
      activeFilter === 'all' ||
      t.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(activeFilter.toLowerCase()));
    if (!matchesFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      (t.suggestedBrand && t.suggestedBrand.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-4 font-poppins">
      {/* ========================================================================= */}
      {/* 1. SELECTED ITEM DISPLAY (MATCHING REFERENCE SCREENSHOT 3)                */}
      {/* ========================================================================= */}
      {selectedImage && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700 dark:text-[#EDEDED] text-sm font-semibold">
              Selected part image (1)
            </span>
            <button
              type="button"
              onClick={() => setShowLibrary(!showLibrary)}
              className="text-xs text-brand-orange-dark dark:text-[#FB714B] font-semibold hover:underline cursor-pointer bg-transparent border-0 inline-flex items-center gap-1"
            >
              <HiOutlineArrowPath className="w-3.5 h-3.5" />
              {showLibrary ? 'Hide image library' : 'Change image'}
            </button>
          </div>

          <div className="p-3.5 bg-white dark:bg-[#121212] rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Index Number */}
              <span className="text-xs font-bold text-neutral-400 dark:text-[#737373] pl-1">
                1.
              </span>

              {/* Thumbnail Container with Google Lens Style Zoom Effect */}
              <div
                ref={thumbRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setLensModalOpen(true)}
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-brand-cream/50 dark:bg-[#1A1A1A] border border-neutral-200 dark:border-[#262626] flex items-center justify-center shrink-0 cursor-crosshair group shadow-2xs"
                title="Hover to magnify, click for Google Lens inspection"
              >
                <img
                  src={selectedImage}
                  alt={selectedTitle}
                  className="w-full h-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
                />

                {/* Google Lens Indicator Icon in corner */}
                <div className="absolute bottom-1 right-1 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <HiOutlineViewfinderCircle className="w-3.5 h-3.5" />
                </div>

                {/* Floating Google Lens Loupe Magnifier on Hover */}
                {isHovering && (
                  <div
                    className="pointer-events-none absolute w-20 h-20 rounded-full border-2 border-brand-orange dark:border-[#FB714B] shadow-2xl overflow-hidden hidden sm:block z-30"
                    style={{
                      left: `${loupePos.x - 40}px`,
                      top: `${loupePos.y - 40}px`,
                      backgroundImage: `url(${selectedImage})`,
                      backgroundPosition: `${loupePos.bgX}% ${loupePos.bgY}%`,
                      backgroundSize: '280%',
                      backgroundRepeat: 'no-repeat',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Viewfinder crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                      <div className="w-2 h-0.5 bg-brand-orange dark:bg-[#FB714B]" />
                      <div className="h-2 w-0.5 bg-brand-orange dark:bg-[#FB714B] absolute" />
                    </div>
                  </div>
                )}
              </div>

              {/* Title & Tags */}
              <div className="min-w-0">
                <span className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED] truncate block">
                  {selectedTitle}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {selectedTemplate?.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-brand-cream dark:bg-[#1C1C1C] border border-brand-border dark:border-[#262626] text-neutral-600 dark:text-[#A1A1A1]"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLensModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] text-brand-orange-dark dark:text-[#FB714B] hover:underline cursor-pointer bg-transparent border-0 p-0 ml-1 font-medium"
                  >
                    <HiOutlineViewfinderCircle className="w-3.5 h-3.5" />
                    Zoom
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Change & Trash */}
            <div className="flex items-center gap-1.5 shrink-0 pr-1">
              <button
                type="button"
                onClick={() => setShowLibrary(!showLibrary)}
                className="p-2 rounded-xl text-neutral-500 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer border-0 bg-transparent"
                title="Change image"
              >
                <HiOutlineArrowPath className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onRemoveImage}
                className="p-2 rounded-xl text-neutral-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer border-0 bg-transparent"
                title="Remove image"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. IMAGE PICKER LIBRARY (MATCHING REFERENCE SCREENSHOT 2)                 */}
      {/* ========================================================================= */}
      {showLibrary && (
        <div className="p-4 sm:p-5 bg-white dark:bg-[#121212] rounded-2xl border border-brand-border dark:border-[#262626] shadow-xs flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900 dark:text-[#EDEDED]">
              Choose part image
            </span>
            {selectedImage && (
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer bg-transparent border-0 font-medium"
              >
                Done
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="flex items-center bg-brand-cream/60 dark:bg-[#161616] rounded-xl border border-brand-border dark:border-[#262626] px-3.5 py-2 gap-2 shadow-xs focus-within:border-brand-orange dark:focus-within:border-[#FB714B]">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-neutral-400 dark:text-[#737373] shrink-0" />
            <input
              type="text"
              placeholder="Search part images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs text-neutral-800 dark:text-[#EDEDED] bg-transparent border-0 focus:outline-none placeholder:text-neutral-400 dark:placeholder:text-[#737373] font-poppins"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-[#EDEDED] cursor-pointer bg-transparent border-0 p-0"
              >
                <HiOutlineXMark className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {[
              { id: 'all', label: 'All parts' },
              { id: 'braking', label: 'Braking system' },
              { id: 'drivetrain', label: 'Drivetrain & chains' },
              { id: 'handle', label: 'Handle Bar & Handle Grip' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`py-1.5 px-3 rounded-xl font-medium shrink-0 transition-colors border cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#121212] dark:bg-white text-white dark:text-neutral-900 border-transparent shadow-xs'
                    : 'bg-brand-cream/60 dark:bg-[#1A1A1A] border-brand-border dark:border-[#262626] text-neutral-600 dark:text-[#A1A1A1] hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Scrollable Grid of Part Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
            {/* 1. Custom Upload Card */}
            <label className="flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-[#262626] hover:border-brand-orange dark:hover:border-[#FB714B] bg-brand-cream/40 dark:bg-[#1A1A1A] cursor-pointer transition-colors text-center group">
              <HiOutlinePhoto className="w-8 h-8 text-neutral-400 group-hover:text-brand-orange dark:group-hover:text-[#FB714B] transition-colors mb-1.5 stroke-1" />
              <span className="text-xs font-bold text-neutral-800 dark:text-[#EDEDED] block">
                Upload photo
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-[#A1A1A1] mt-0.5">
                From your device
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* 2. Visual Templates Grid */}
            {filteredTemplates.map((template) => {
              const isChosen = selectedImage === template.imageUrl;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    onSelectImage(template.imageUrl, template);
                    setShowLibrary(false);
                  }}
                  className={`flex flex-col justify-between p-3 rounded-2xl border transition-all cursor-pointer relative group bg-white dark:bg-[#161616] ${
                    isChosen
                      ? 'border-brand-orange dark:border-[#FB714B] ring-2 ring-brand-orange/20 dark:ring-[#FB714B]/30 shadow-xs'
                      : 'border-brand-border dark:border-[#262626] hover:border-neutral-400 dark:hover:border-[#404040]'
                  }`}
                >
                  {isChosen && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-orange dark:bg-[#FB714B] text-white flex items-center justify-center shadow-xs">
                      <HiOutlineCheck className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Image illustration */}
                  <div className="w-full h-24 flex items-center justify-center rounded-xl bg-brand-cream/40 dark:bg-[#1C1C1C] overflow-hidden p-2">
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Title */}
                  <div className="mt-2.5">
                    <span className="text-xs font-bold text-neutral-900 dark:text-[#EDEDED] line-clamp-1 block leading-snug">
                      {template.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. FULL-FEATURED IMAGE ZOOM & BACKGROUND REMOVER MODAL                    */}
      {/* ========================================================================= */}
      <ImageZoomModal
        isOpen={lensModalOpen && !!selectedImage}
        onClose={() => setLensModalOpen(false)}
        imageUrl={selectedImage}
        title={selectedTitle}
        brand={selectedTemplate?.suggestedBrand}
        sku={selectedTemplate?.suggestedSku}
        category={selectedTemplate?.category}
      />
    </div>
  );
};

export default PartImagePicker;
