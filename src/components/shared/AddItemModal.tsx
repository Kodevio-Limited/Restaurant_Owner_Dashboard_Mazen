'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, X, Globe, Upload, Plus, Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function CustomizationGroup({
  lang,
  onRemove,
}: {
  lang: 'EN' | 'AR';
  onRemove: () => void;
}) {
  const [options, setOptions] = useState([{ name: '', price: '' }, { name: '', price: '' }]);
  const [selectionType, setSelectionType] = useState<'Single' | 'Multi'>('Multi');
  const [required, setRequired] = useState(false);

  const addOption = () => setOptions((p) => [...p, { name: '', price: '' }]);
  const removeOption = (i: number) => setOptions((p) => p.filter((_, idx) => idx !== i));

  return (
    <div className="w-full rounded-[10px] outline outline-2 outline-offset-[-1.9px] outline-[#989898]">
      <div className="flex flex-col gap-5 p-[18px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium leading-5 text-[#686868]">Group Name</span>
            <span className="inline-flex items-center gap-2 rounded-[33.18px] bg-[#F2F2F2] px-3 py-1.5 text-base font-medium text-[#026F4F]">
              <Globe size={18} /> {lang}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-full items-center rounded-[82.49px] bg-[#F2F2F2] px-4 sm:w-96">
              <span className="font-satoshi text-base font-medium leading-5 text-[#989898]">e.g. Extras, Meat</span>
            </div>
            <button onClick={onRemove} aria-label="Remove group" className="flex h-12 w-12 items-center justify-center rounded-md bg-[#E85E5E] text-white">
              <Trash2 size={22} />
            </button>
          </div>
        </div>

        <div className="flex w-64 flex-col gap-2">
          <span className="text-sm font-medium leading-5 text-[#686868]">Selection Type</span>
          <div className="relative flex h-12 items-center rounded-[35.08px] bg-[#E9E9E9]">
            <button onClick={() => setSelectionType('Single')} className={cn('flex h-10 w-32 items-center justify-center rounded-3xl text-sm font-medium leading-5 transition-colors', selectionType === 'Single' ? 'bg-[#026F4F] text-white' : 'text-[#989898]')}>Single</button>
            <button onClick={() => setSelectionType('Multi')} className={cn('flex h-10 w-32 items-center justify-center rounded-3xl text-sm font-medium leading-5 transition-colors', selectionType === 'Multi' ? 'bg-[#026F4F] text-white' : 'text-[#989898]')}>Multi</button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <span className="text-sm font-medium leading-5 text-[#686868]">Required Selection</span>
          <div onClick={() => setRequired(!required)} className={cn('relative h-6 w-12 cursor-pointer rounded-[18.96px] transition-colors', required ? 'bg-[#026F4F]' : 'bg-[#989898]')}>
            <span className={cn('absolute top-[3.32px] h-4 w-4 rounded-full bg-white transition-transform', required ? 'left-[28px]' : 'left-[3.79px]')} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium leading-5 text-[#686868]">Selection Limit</span>
          </div>
          <div className="flex h-12 w-full items-center justify-between rounded-[82.49px] bg-[#F2F2F2] px-4">
            <span className="text-base font-medium leading-5 text-[#989898]">No Limit</span>
            <ChevronDown size={18} className="text-[#989898]" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium leading-5 text-[#686868]">Options</span>
          <div className="flex flex-col gap-3">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-full items-center rounded-[82.49px] bg-[#F2F2F2] px-4 sm:w-80">
                    <span className="font-satoshi text-base font-medium leading-5 text-[#989898]">Option name</span>
                  </div>
                  <div className="flex h-11 w-32 items-center rounded-[82.49px] bg-[#F2F2F2] px-4">
                    <span className="font-satoshi text-base font-medium leading-5 text-[#989898]">EGP 0.00</span>
                  </div>
                </div>
                <button onClick={() => removeOption(i)} aria-label="Remove option" className="flex h-7 w-7 items-center justify-center">
                  <X size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addOption} className="inline-flex items-center gap-1 text-xs font-medium leading-4 text-[#026F4F]">
            <Plus size={18} className="text-[#026F4F]" /> Add Option
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddItemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [customizations, setCustomizations] = useState<number[]>([]);
  const addCustomization = () => setCustomizations((p) => [...p, p.length]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full flex-col rounded-tl-3xl rounded-bl-3xl bg-[#F2F2F2] shadow-[-2px_0px_12px_rgba(0,0,0,0.10)] transition-transform duration-300 sm:w-[619px]',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex shrink-0 items-center justify-between px-5 pt-6">
          <button onClick={onClose} aria-label="Back" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E9E9] text-black transition-colors hover:bg-[#DcDcDc]">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-[32px] font-medium leading-10 text-black">Add New Item</h2>
          <button onClick={onClose} aria-label="Close" className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E85E5E] text-white transition-colors hover:bg-[#d94a4a]">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-5 pb-5 pt-8">
          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="px-[19px] pt-[19px]">
              <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Product Image</h3>
            </div>
            <div className="mx-[19px] mb-5 mt-4 flex h-44 items-center justify-center rounded-xl outline outline-2 outline-offset-[-2px] outline-[#989898]">
              <div className="flex flex-col items-center gap-1.5">
                <Upload size={40} className="text-[#989898]" />
                <span className="text-lg font-semibold leading-7 text-[#026F4F]">Upload Photo<span className="text-base font-medium leading-6 text-[#989898]"> or drag and drop</span></span>
                <span className="text-xs font-normal leading-5 text-[#989898]">PNG, JPG up to 2MB</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5 px-[19px] py-[19px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium leading-5 text-[#686868]">Item name</span>
                  <span className="inline-flex items-center gap-2 rounded-[35px] bg-[#F2F2F2] px-3 py-1.5 text-base font-medium text-[#026F4F]"><Globe size={22} /> EN</span>
                </div>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Enter your name...</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Description</span>
                <div className="flex h-24 items-start rounded-xl bg-[#F2F2F2] px-4 py-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Briefly describe the item....</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-3.5 px-[19px] py-[19px]">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium leading-5 text-[#686868]">Item name</span>
                  <span className="inline-flex h-9 w-20 items-center gap-2 rounded-[35px] bg-[#F2F2F2] px-3 py-1.5 text-base font-medium text-[#026F4F]"><Globe size={22} /> AR</span>
                </div>
                <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Enter your name...</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base font-medium leading-5 text-[#686868]">Description</span>
                <div className="flex h-24 items-start rounded-xl bg-[#F2F2F2] px-4 py-4">
                  <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Briefly describe the item....</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-6 px-[19px] py-[23px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">Price (EGP)</span>
                  <div className="flex h-14 items-center rounded-[87px] bg-[#F2F2F2] px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">0.00</span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-60">
                  <span className="text-base font-medium leading-5 text-[#686868]">Category</span>
                  <div className="flex h-14 items-center justify-between rounded-[87px] bg-[#F2F2F2] px-4">
                    <span className="font-satoshi text-base font-medium leading-6 text-[#989898]">Burgers</span>
                    <ChevronDown size={18} className="text-[#989898]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex w-44 flex-col gap-3">
                  <span className="text-lg font-medium leading-7 text-[#2D2F33]">Availability</span>
                  <span className="text-xs font-normal leading-5 text-[#989898]">Show item on the live menu</span>
                </div>
                <div className="relative h-6 w-12 cursor-pointer rounded-[20px] bg-[#026F4F]">
                  <span className="absolute right-[3.5px] top-[3.5px] h-4 w-4 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white outline outline-1 outline-offset-[-1px] outline-[#E9E9E9]">
            <div className="flex flex-col gap-4 px-[18px] py-[18px]">
              <div className="flex w-64 flex-col gap-1.5">
                <h3 className="text-lg font-semibold leading-7 text-[#2D2F33]">Customizations</h3>
                <p className="text-xs font-normal leading-5 text-[#989898]">Define add-ons, modifiers, and preferences.</p>
              </div>
              {customizations.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-xl bg-[#F2F2F2]">
                  <div className="flex flex-col items-center gap-3">
                    <Plus size={28} className="text-[#989898]" />
                    <span className="text-xs font-medium leading-5 text-[#989898]">No customizations added..</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {customizations.map((_, i) => (
                    <CustomizationGroup key={i} lang={i === 1 ? 'AR' : 'EN'} onRemove={() => setCustomizations((p) => p.filter((_, idx) => idx !== i))} />
                  ))}
                </div>
              )}
              <button onClick={addCustomization} className="flex h-14 items-center justify-center rounded-[87px] outline outline-2 outline-offset-[-2px] outline-[#989898]">
                <span className="inline-flex items-center gap-1 text-base font-medium leading-6 text-[#989898]">
                  <Plus size={22} /> Add Customization
                </span>
              </button>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-[#E2E2E2] px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#E9E9E9] text-lg font-medium text-[#2D2F33] outline outline-1 outline-offset-[-1px] outline-[#B9B9B9] transition-colors hover:bg-[#DcDcDc]"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex h-14 flex-1 items-center justify-center rounded-[30px] bg-[#026F4F] text-lg font-medium text-white shadow-[0px_4px_16.3px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#015c42]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
