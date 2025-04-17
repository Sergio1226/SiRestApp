const getMenu = (data) => {
    let menu = data.descripcionMenu + "\n\n";
    data.detallesMenus.forEach(element => {
      const tipo = fixEncoding(element.tiposProducto?.nombreTipoProducto || "Tipo desconocido");
      const ingrediente = element.descripcionIngrediente;
      menu += `${tipo} - ${ingrediente}\n`;
    });
    menu += `\n${data.restaurantes.nombreRestaurante}`;
    return menu;
};

const fixEncoding = (text) => {
    if (text.startsWith("Prote")) {
      return "Proteínico";
    }else if(text.startsWith("Fari")) {
        return text.endsWith("2") ? "Farináceo No. 2" : text.endsWith("1") ? "Farináceo No. 1" : text;
    }
    return text;
};
