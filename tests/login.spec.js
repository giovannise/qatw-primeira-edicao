import { test, expect } from '@playwright/test';

import { obterCodigo2FA } from '../support/db';

import { LoginPage } from '../pages/LoginPage';

import ( DashPage ) from '../pages/DashPage';

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

  await loginPage.acessaPagina()
  await loginPage.informaCpf(user.cpf)
  await loginPage.informaSenha(user.senha)

  //temporário
  await page.waitForTimeout(3000);

  const code = await obterCodigo2FA()
  await loginPage.informa2FA(code)
  
  //temporário
  await page.waitForTimeout(2000)
  
  expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});