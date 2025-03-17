import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">EdunexIA</span>
            </div>
            <p className="text-gray-600">
              Transformando a educação através da tecnologia e inovação.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Produto</h3>
            <ul className="space-y-2">
              <li><Link to="/recursos" className="text-gray-600 hover:text-gray-900">Recursos</Link></li>
              <li><Link to="/precos" className="text-gray-600 hover:text-gray-900">Preços</Link></li>
              <li><Link to="/depoimentos" className="text-gray-600 hover:text-gray-900">Depoimentos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="/ajuda" className="text-gray-600 hover:text-gray-900">Central de Ajuda</Link></li>
              <li><Link to="/contato" className="text-gray-600 hover:text-gray-900">Contato</Link></li>
              <li><Link to="/documentacao" className="text-gray-600 hover:text-gray-900">Documentação</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacidade" className="text-gray-600 hover:text-gray-900">Privacidade</Link></li>
              <li><Link to="/termos" className="text-gray-600 hover:text-gray-900">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} EdunexIA. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;