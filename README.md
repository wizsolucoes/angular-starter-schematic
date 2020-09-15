<!-- omit in toc -->
# Wiz Angular Starter Schematic

- [Sobre](#sobre)
- [Uso](#uso)
- [Desenvolvimento](#desenvolvimento)
  - [Testando o schematic localmente](#testando-o-schematic-localmente)
    - [1. Gere um distribuível do schematic](#1-gere-um-distribuível-do-schematic)
    - [2. Gere uma nova aplicação e instale e execute o schematic](#2-gere-uma-nova-aplicação-e-instale-e-execute-o-schematic)
  - [Aprenda mais sobre schematics](#aprenda-mais-sobre-schematics)


## Sobre
Schematic para gerar código boilerplate com a [arquitetura de referência para aplicações Angular](https://github.com/wizsolucoes/angular-starter).

Compatível com as [versões suportadas do Angular](https://angular.io/guide/releases#support-policy-and-schedule) (^8.0.0, ^9.0.0 e ^10.0.0) e otimizado para as versões ^10.0.0.

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
# Instalar as dependências
npm install

# Buildar schematic
npm run build

# Executar os testes
npm test
```

### Testando o schematic localmente

#### 1. Gere um distribuível do schematic

```bash
# Instalar as dependências
npm install

# Buildar schematic
npm run build

# Gerar tarball eg. wizsolucoes-angular-starter-1.0.1.tgz
npm pack
```

#### 2. Gere uma nova aplicação e instale e execute o schematic

```bash
# Gerar uma nova aplicação Angular
ng new my-app --style=scss

# Entrar na pasta da nova aplicação
cd my-app

# Instalar schematic
npm i --no-save ../path/to/angular-starter-schematic/wizsolucoes-angular-starter-1.0.1.tgz

# Executar schematic
ng g @wizsolucoes/angular-starter:ng-add
```

### Aprenda mais sobre schematics
- [Generating code using schematics](https://angular.io/guide/schematics)
- [Total Guide To Custom Angular Schematics](https://medium.com/@tomastrajan/total-guide-to-custom-angular-schematics-5c50cf90cdb4)