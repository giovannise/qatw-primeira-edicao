import pgPromise from 'pg-promise'

const pgp = pgPromise()
// postgresql = servidor de banco de dados
//dba = usuário
// dba = senha
//paybank-db = nome do container
//5432 = porta
//UserDb = nome do banco
//e todas essas informações estão no arquivo docker-compose.yml
const db = pgp('postgresql://dba:dba@paybank-db:5432/UserDB')

//função assíncrona, pois fica "esperando" uma resposta enquanto executa
//export, pois preciso importar ela lá no meu teste
export async function obterCodigo2FA(cpf) {
    // cria uma variável query que consulta no banco:
    // SELECT code (ou seja, o código de 2 fatores enviado por email)
	// FROM public."TwoFactorCode"
	// ORDER BY id DESC (ordena do último recebido até o primeiro)
	// LIMIT 1; (pega somente 1 resultado, ou seja, o mais recente)
    const query = `
        SELECT t.code 
        FROM public."TwoFactorCode" t	
        JOIN public."User" u ON u."id" = t."userId"	
        WHERE u."cpf" = '${cpf}' 
        ORDER BY t.id DESC 
        LIMIT 1;`

    //cria uma constante que recebe 1 ou nenhum resultado da query, que também é o retorno da função
    const result = await db.oneOrNone(query)
    return result.code
}