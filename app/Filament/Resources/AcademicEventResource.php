<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AcademicEventResource\Pages;
use App\Models\AcademicEvent;
use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\DateColumn;

class AcademicEventResource extends Resource
{
    protected static ?string $model = AcademicEvent::class;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('user_id')->relationship('user', 'name')->required()->label('Usuario'),
            TextInput::make('title')->required()->label('Título'),
            DatePicker::make('date')->required()->label('Fecha'),
            TextInput::make('linked_expense_category')->label('Categoría vinculada'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('user.name')->label('Usuario'),
            TextColumn::make('title')->label('Título'),
            DateColumn::make('date')->label('Fecha'),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\DeleteBulkAction::make(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAcademicEvents::route('/'),
            'create' => Pages\CreateAcademicEvent::route('/create'),
            'edit' => Pages\EditAcademicEvent::route('/{record}/edit'),
        ];
    }
}
