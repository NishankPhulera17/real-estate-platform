import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceINR(val: number): string {
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(2);
    return `₹${cr.endsWith('.00') ? cr.slice(0, -3) : cr} Cr`;
  } else if (val >= 100000) {
    const lakh = (val / 100000).toFixed(2);
    return `₹${lakh.endsWith('.00') ? lakh.slice(0, -3) : lakh} Lakh`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  }
}

export function formatNumberIN(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}
