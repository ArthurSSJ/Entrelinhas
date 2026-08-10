import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password, action } = await req.json();

    // Ação de Logout
    if (action === 'logout') {
      const response = NextResponse.json({ success: true });
      response.cookies.set('entrelinhas_admin_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    // Senha definida no .env ou senha padrão segura de contingência
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123entrelinhas';

    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Senha incorreta. Verifique suas credenciais de administrador.' },
        { status: 401 }
      );
    }

    // Criar cookie de sessão seguro HTTP-only (Validade: 7 dias)
    const token = Buffer.from(`admin:${Date.now()}:${expectedPassword}`).toString('base64');
    const response = NextResponse.json({ success: true });

    response.cookies.set('entrelinhas_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao processar login' }, { status: 500 });
  }
}
