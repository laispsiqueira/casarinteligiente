
export const exportToCSV = (data: any[], fileName: string) => {
  if (!data || data.length === 0) return;

  // Extrair cabeçalhos a partir das chaves do primeiro objeto
  const headers = Object.keys(data[0]);
  
  // Criar linhas
  const rows = data.map(obj => 
    headers.map(header => {
      let value = obj[header] === null || obj[header] === undefined ? "" : obj[header];
      // Escapar aspas duplas e garantir que o valor seja string
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  // Unir cabeçalhos e linhas com BOM para suporte a caracteres especiais no Excel
  const csvContent = `\uFEFF${headers.join(',')}\n${rows.join('\n')}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
