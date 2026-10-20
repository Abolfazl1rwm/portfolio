import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

// گزینهٔ یک روش ارتباطی
export interface ContactMethodOption {
  value: string;
  label: string;
}

interface ContactMethodFieldProps {
  id: string;
  label: string;
  methods: ContactMethodOption[];
  methodValue: string;
  onMethodChange: (value: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder?: string;
}

// کامپوننت مشترک برای انتخاب «راه ارتباطی» (ایمیل/تلفن/تلگرام/سایر) به همراه مقدار آن
// در فرم‌های «همکاری» و «نظر و پیشنهاد» استفاده می‌شود
export function ContactMethodField({
  id,
  label,
  methods,
  methodValue,
  onMethodChange,
  inputValue,
  onInputChange,
  placeholder,
}: ContactMethodFieldProps) {
  const { isRTL } = useLanguage();
  const fieldClass = isRTL ? 'text-right' : '';

  return (
    <div>
      <label htmlFor={id} className={`block text-sm font-medium text-foreground mb-2 ${fieldClass}`}>
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={methodValue} onValueChange={onMethodChange}>
          <SelectTrigger className={`rounded-lg sm:w-40 sm:shrink-0 ${fieldClass}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
            {methods.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-lg"
          dir="ltr"
        />
      </div>
    </div>
  );
}
