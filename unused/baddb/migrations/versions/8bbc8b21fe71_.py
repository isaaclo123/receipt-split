"""empty message

Revision ID: 8bbc8b21fe71
Revises: 
Create Date: 2020-06-20 22:22:52.213805

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8bbc8b21fe71'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=100), nullable=False),
    sa.Column('password', sa.String(length=100), nullable=False),
    sa.Column('fullname', sa.String(length=100), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('friend',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('accepted', sa.Boolean(), nullable=True),
    sa.Column('archived', sa.Boolean(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('from_user_id', sa.Integer(), nullable=True),
    sa.Column('to_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['from_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['to_user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payment',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('accepted', sa.Boolean(), nullable=True),
    sa.Column('archived', sa.Boolean(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('message', sa.String(length=300), nullable=True),
    sa.Column('amount', sa.Float(asdecimal=True), nullable=False),
    sa.Column('from_user_id', sa.Integer(), nullable=True),
    sa.Column('to_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['from_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['to_user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('receipt',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('amount', sa.Float(asdecimal=True), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('resolved', sa.Boolean(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('settlement',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('from_user_id', sa.Integer(), nullable=False),
    sa.Column('to_user_id', sa.Integer(), nullable=False),
    sa.Column('paid_amount', sa.Float(asdecimal=True), nullable=False),
    sa.Column('owed_amount', sa.Float(asdecimal=True), nullable=False),
    sa.CheckConstraint('from_user_id <> to_user_id'),
    sa.ForeignKeyConstraint(['from_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['to_user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('from_user_id', 'to_user_id')
    )
    op.create_table('balance',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(asdecimal=True), nullable=False),
    sa.Column('paid', sa.Boolean(), nullable=False),
    sa.Column('receipt_id', sa.Integer(), nullable=True),
    sa.Column('from_user_id', sa.Integer(), nullable=True),
    sa.Column('to_user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['from_user_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['receipt_id'], ['receipt.id'], ),
    sa.ForeignKeyConstraint(['to_user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('receiptitem',
    sa.Column('created_on', sa.DateTime(), nullable=True),
    sa.Column('updated_on', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('receipt_id', sa.Integer(), nullable=True),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('amount', sa.Float(asdecimal=True), nullable=False),
    sa.ForeignKeyConstraint(['receipt_id'], ['receipt.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_receipt_association',
    sa.Column('left_id', sa.Integer(), nullable=True),
    sa.Column('right_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['left_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['right_id'], ['receipt.id'], )
    )
    op.create_table('user_receiptitem_association',
    sa.Column('left_id', sa.Integer(), nullable=True),
    sa.Column('right_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['left_id'], ['user.id'], ),
    sa.ForeignKeyConstraint(['right_id'], ['receiptitem.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_receiptitem_association')
    op.drop_table('user_receipt_association')
    op.drop_table('receiptitem')
    op.drop_table('balance')
    op.drop_table('settlement')
    op.drop_table('receipt')
    op.drop_table('payment')
    op.drop_table('friend')
    op.drop_table('user')
    # ### end Alembic commands ###