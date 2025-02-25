import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';

import { cleanJobs, getJob } from '../support/redis';

test('Não deve logar quando o código de autenticação é inválido', async ({ page }) => {

  const loginPage = new LoginPage(page)

  const user = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.acessaPagina()
  await loginPage.informaCpf(user.cpf)
  await loginPage.informaSenha(user.senha)
  
  await page.getByRole('textbox', { name: '000000' }).fill('123456');
  await page.getByRole('button', { name: 'Verificar' }).click();

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  const user = {
    cpf: '00000014141',
    senha: '147258'
  }

  await cleanJobs()

  await loginPage.acessaPagina()
  await loginPage.informaCpf(user.cpf)
  await loginPage.informaSenha(user.senha)

  //checkpoint
  //tem até 3seg para ir para a próxima etapa. 
  // Ganho de performance com relação ao "await page.waitForTimeout(3000)", pois ele não espera necessariamente 3s, mas segue assim que encontrar a página correta.
  //e ainda garante que está indo para o lugar correto
  await page.getByRole('heading', {name: 'Verificação em duas etapas'})
    .waitFor({timeout: 3000})

  //este código traz o código de 2 fatores lá do Redis
  //const codigo = await getJob()
  //este código traz o código de 2 fatores lá do banco de dados
  const codigo = await obterCodigo2FA(user.cpf)
  await loginPage.informa2FA(codigo)
  
  //aqui não precisa de timeout porque colocando await antes do expect, ele vai esperar a troca de página (que nesse caso realmente troca a URL)
  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});