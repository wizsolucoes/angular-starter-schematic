# Wiz Anglar Starter Schematic

Repositório para o Schematic para gerar código bolierplate com a [arquitetura de referência para aplicações Angular](https://github.com/wizsolucoes/angular-starter).


## Uso

```bash
# Generate a new angular application
ng new my-app --style=scss

# Enter the directory
cd my-app

# Add Wiz starter arquitecture
ng add @wizsolucoes/angular-starter
```

**IMPORTANTE: Este schematic supõe que a aplicação usa SASS e deve ser executado em projetos novos, pois faz a sobrescrita de arquivos.**

## Desenvolvimento

```bash
# Instale as dependências
npm install

# Buildar schematic
npm run build

# Executar os testes
npm test
```

### Aprenda mais sobre schematics
- [Generating code using schematics](https://angular.io/guide/schematics)
- [Total Guide To Custom Angular Schematics](https://medium.com/@tomastrajan/total-guide-to-custom-angular-schematics-5c50cf90cdb4)