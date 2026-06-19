-- Inserir itens de teste na tabela "items"
INSERT INTO "items" (id, name, category, supplier, stock, "minStock", "averageCost", description, notes, status, created_at, updated_at) VALUES
(gen_random_uuid(), 'Fragrância de Lavanda', 'Fragrância', 'Fornecedor de Fragrâncias A', 10000, 2000, 0.05, 'Fragrância relaxante de lavanda para ambientes.', 'Lote #12345', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Fragrância Cítrica', 'Fragrância', 'Fornecedor de Fragrâncias B', 8000, 1500, 0.06, 'Fragrância refrescante com notas de limão e laranja.', NULL, 'active', NOW(), NOW()),
(gen_random_uuid(), 'Neutralizador de Odores', 'Suprimento', 'Fornecedor de Químicos C', 50, 10, 5.50, 'Spray para neutralizar odores em áreas de serviço.', 'Manter em local arejado', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Óleo Essencial de Eucalipto', 'Fragrância', 'Fornecedor de Fragrâncias A', 12000, 2500, 0.08, 'Óleo concentrado de eucalipto para difusores.', 'Produto premium', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Filtro de Ar para Máquina', 'Peça de Reposição', 'Fornecedor de Peças D', 100, 20, 12.75, 'Filtro de ar compatível com o modelo X.', 'Verificar compatibilidade antes de usar', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Fragrância de Baunilha', 'Fragrância', 'Fornecedor de Fragrâncias B', 9500, 2000, 0.07, 'Fragrância doce e acolhedora de baunilha.', NULL, 'active', NOW(), NOW()),
(gen_random_uuid(), 'Solução de Limpeza para Máquinas', 'Suprimento', 'Fornecedor de Químicos C', 30, 5, 25.00, 'Solução para limpeza interna das máquinas de fragrância.', 'Usar luvas durante o manuseio', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Fragrância Floral', 'Fragrância', 'Fornecedor de Fragrâncias A', 7000, 1500, 0.06, 'Mix de flores do campo.', 'Edição limitada', 'active', NOW(), NOW());
(gen_random_uuid(), 'Máquina Difusora Modelo A', 'Equipamento', 'Fornecedor de Equipamentos E', 50, 10, 150.00, 'Difusor de fragrâncias para pequenos ambientes.', 'Bivolt', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Máquina Difusora Modelo B', 'Equipamento', 'Fornecedor de Equipamentos E', 30, 5, 350.00, 'Difusor de fragrâncias para grandes áreas, com programação.', 'Requer instalação profissional', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Luvas de Proteção (par)', 'Suprimento', 'Fornecedor de Químicos C', 200, 50, 1.50, 'Luvas de látex para manuseio de químicos.', 'Tamanho único', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Escada Pequena', 'Equipamento', 'Fornecedor Geral F', 15, 3, 75.00, 'Escada de 3 degraus para manutenção.', NULL, 'active', NOW(), NOW());
(gen_random_uuid(), 'Panos de Microfibra (kit com 10)', 'Insumo', 'Fornecedor Geral F', 150, 30, 15.00, 'Panos para limpeza geral das máquinas e ambientes.', 'Reutilizáveis', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Álcool Isopropílico 1L', 'Insumo', 'Fornecedor de Químicos C', 80, 20, 22.50, 'Álcool para limpeza de componentes eletrônicos das máquinas.', 'Manter longe de fontes de calor', 'active', NOW(), NOW()),
(gen_random_uuid(), 'Pilhas AA (pacote com 4)', 'Insumo', 'Fornecedor Geral F', 300, 100, 8.00, 'Pilhas alcalinas para dispositivos de backup.', NULL, 'active', NOW(), NOW());

-- Inserir tipos de grades de horários
INSERT INTO "grades" (id, name, "timeBetween") VALUES
(gen_random_uuid(), 'Baixa', 60),
(gen_random_uuid(), 'Média', 30),
(gen_random_uuid(), 'Alta', 15);

update "items" set category = 'Equipamento' where category = 'Suprimento'
