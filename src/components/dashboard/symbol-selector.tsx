'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { fetchSymbols } from '@/lib/bybit-api';
import { useSymbol } from '@/contexts/symbol-context';

export function SymbolSelector() {
  const [open, setOpen] = React.useState(false);
  const [symbols, setSymbols] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const { symbol, setSymbol } = useSymbol();

  React.useEffect(() => {
    async function loadSymbols() {
      setIsLoading(true);
      try {
        const fetchedSymbols = await fetchSymbols();
        setSymbols(fetchedSymbols);
      } catch (error) {
        console.error('Failed to fetch symbols', error);
        // Handle error appropriately, maybe show a toast
      } finally {
        setIsLoading(false);
      }
    }
    loadSymbols();
  }, []);

  const handleSelect = (currentValue: string) => {
    setSymbol(currentValue === symbol ? '' : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            symbol || 'Select symbol...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search symbol..." />
          <CommandList>
            <CommandEmpty>No symbol found.</CommandEmpty>
            <CommandGroup>
              {symbols.map((s) => (
                <CommandItem
                  key={s}
                  value={s}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      symbol === s ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {s}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
